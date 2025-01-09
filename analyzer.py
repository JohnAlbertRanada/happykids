import sys
import numpy as np
import io
import soundfile as sf
import librosa
import speech_recognition as speech_recog
import json
from pydub import AudioSegment
from pydub import effects
import pronouncing
import subprocess

# Define phoneme mapping (customize this mapping based on your needs)
PHONEME_MAP = {
    'a': 'AH',       # as in "cat"
    'b': 'B',        # as in "bat"
    'c': 'K',        # as in "cat"
    'd': 'D',        # as in "dog"
    'e': 'EH',       # as in "bed"
    'f': 'F',        # as in "fish"
    'g': 'G',        # as in "go"
    'h': 'H',        # as in "hat"
    'i': 'IH',       # as in "sit"
    'j': 'JH',       # as in "jump"
    'k': 'K',        # as in "kite"
    'l': 'L',        # as in "lamp"
    'm': 'M',        # as in "man"
    'n': 'N',        # as in "no"
    'o': 'OW',       # as in "go"
    'p': 'P',        # as in "pen"
    'q': 'K',        # as in "queen"
    'r': 'R',        # as in "red"
    's': 'S',        # as in "sun"
    't': 'T',        # as in "top"
    'u': 'AH',       # as in "cup"
    'v': 'V',        # as in "van"
    'w': 'W',        # as in "water"
    'x': 'K',        # as in "box"
    'y': 'Y',        # as in "yes"
    'z': 'Z',        # as in "zebra"
    
    # Additional phonemes
    'aa': 'AA',      # as in "father"
    'ae': 'AE',      # as in "cat"
    'ah': 'AH',      # as in "father"
    'ao': 'AO',      # as in "law"
    'aw': 'AW',      # as in "how"
    'ay': 'AY',      # as in "say"
    'ei': 'EY',      # as in "say"
    'ou': 'AW',      # as in "out"
    'oy': 'OY',      # as in "boy"
    'ch': 'CH',      # as in "cheese"
    'sh': 'SH',      # as in "shoe"
    'th': 'TH',      # as in "think"
    'zh': 'ZH',      # as in "measure"
    
    # Common digraphs
    'ng': 'NG',      # as in "sing"
    'wh': 'W',       # as in "what"
    'ph': 'F',       # as in "phone"
}

def phonemes_from_text(text):
    phoneme = pronouncing.phones_for_word(text)

    if ' ' in text:
        """Convert a sentence into a list of phonemes."""
        phonemes = []
        
        # Split the sentence into words
        words = text.split()
        
        for word in words:
            # Get phonemes for each word
            phoneme_list = pronouncing.phones_for_word(word)
            
            # Check if there are phonemes available
            if phoneme_list:
                # Take the first phoneme representation and split into individual phonemes
                phonemes.extend(phoneme_list[0].replace('1', '').split())
            # else:
            #     print(f"No phonemes found for word: {word}")
        
        return phonemes
    else:
      """Convert text to a list of phonemes based on the defined phoneme mapping."""
      return [item.replace('1', '') for item in phoneme[0].split()]

def analyze_phonemes(reference_text, transcription):
    """Analyze phonemes and provide feedback on incorrect ones."""
    reference_phonemes = phonemes_from_text(reference_text)
    transcription_phonemes = phonemes_from_text(transcription)
    
    incorrect_phonemes = []
    
    # Compare the phonemes from transcription with reference phonemes
    for idx, phoneme in enumerate(transcription_phonemes):
        if idx >= len(reference_phonemes) or phoneme != reference_phonemes[idx]:
            incorrect_phonemes.append((phoneme, reference_phonemes[idx] if idx < len(reference_phonemes) else None))

    return incorrect_phonemes

def calculate_phoneme_penalty(incorrect_phonemes, total_phonemes):
    """Calculate penalty based on the number of incorrect phonemes."""
    incorrect_count = len(incorrect_phonemes)
    penalty_ratio = incorrect_count / total_phonemes if total_phonemes > 0 else 1  # Ensure no division by zero
    penalty_percentage = penalty_ratio * 100  # Convert to a percentage
    return penalty_percentage

def calculate_speech_rate(num_words, duration):
    """Calculate speech rate in words per minute."""
    if duration > 0:
        return (num_words / duration) * 60  # Convert to WPM
    return 0

def analyze_long_pauses(y, sr, threshold=0.5):
    """Analyze long pauses in the audio."""
    silent_intervals = librosa.effects.split(y, top_db=20)
    long_pause_count = 0
    
    for start, end in silent_intervals:
        pause_length = (end - start) / sr
        if pause_length >= threshold:  # Consider significant pauses
            long_pause_count += 1
            
    return long_pause_count

def analyze_intonation(y, sr):
    """Analyze intonation based on pitch."""
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    pitch_values = [np.mean(pitches[pitches > 0])]  # Average pitch value
    return np.mean(pitch_values) if pitch_values else 0

def word_error_rate(reference, hypothesis):
    """Calculate word error rate."""
    reference_words = reference.split()
    hypothesis_words = hypothesis.split()
    
    d = np.zeros((len(reference_words) + 1, len(hypothesis_words) + 1), dtype=int)
    
    for i in range(len(reference_words) + 1):
        for j in range(len(hypothesis_words) + 1):
            if i == 0:
                d[i][j] = j  # Deletion
            elif j == 0:
                d[i][j] = i  # Insertion
            else:
                cost = 0 if reference_words[i - 1] == hypothesis_words[j - 1] else 1
                d[i][j] = min(d[i - 1][j] + 1,      # Deletion
                              d[i][j - 1] + 1,      # Insertion
                              d[i - 1][j - 1] + cost)  # Substitution

    return d[len(reference_words)][len(hypothesis_words)] / len(reference_words)

def calculate_fluency_score(y, sr, speech_rate, long_pauses):
    """Calculate fluency score based on speech rate, pauses, and speech consistency."""
    
    # Consistency factor: Calculate how stable the speech rate is over time
    frame_length = int(sr * 1.0)  # Frame length of 1 second
    hop_length = int(sr * 0.5)    # Hop length of 0.5 second for overlap
    short_term_rates = []
    
    for i in range(0, len(y), hop_length):
        frame = y[i:i + frame_length]
        if len(frame) < frame_length:
            break
        duration = librosa.get_duration(y=frame, sr=sr)
        num_words_in_frame = len(frame) // 1000  # Placeholder for actual word count in the frame
        short_term_rate = calculate_speech_rate(num_words_in_frame, duration)
        short_term_rates.append(short_term_rate)
    
    # Calculate speech rate variance to reflect how consistent the speaker is
    if short_term_rates:
        rate_variance = np.var(short_term_rates)
        rate_consistency_score = max(30 - rate_variance * 5, 0)  # Score out of 30
    else:
        rate_consistency_score = 0

    # Scale speech rate score to a maximum of 40 points
    speech_rate_score = min((speech_rate / 200) * 40, 40)  # Score out of 40

    # Adjust long pause score: Capping long pauses at 10 for a max score of 30
    long_pause_score = max(30 - long_pauses * 3, 0)  # Score out of 30

    # Calculate the total fluency score
    fluency_score = speech_rate_score + long_pause_score + rate_consistency_score
    
    # Ensure the score is capped at 100
    fluency_score = min(fluency_score, 100)
    
    return fluency_score

def main(reference_text):
    # Read audio data from stdin
    audio_data = sys.stdin.buffer.read()

    audio = None

    # Convert audio buffer to AudioSegment
    try:
        audio = AudioSegment.from_file(io.BytesIO(audio_data))
        print(audio)
    except Exception as e:
        print(f"Error loading audio: {e}")

        audio = audio.set_frame_rate(16000)
        audio = audio.set_channels(1)
        audio = effects.normalize(audio)  # Normalize audio to reduce noise
        audio = audio.low_pass_filter(3000)  # Apply low pass filter to remove high-frequency noise
        audio = audio.set_sample_width(2)

        # Export the audio to a BytesIO object for in-memory processing
        audio_io = io.BytesIO()
        audio.export(audio_io, format='wav')
        audio_io.seek(0)  # Set the pointer to the start of the audio data

        # Load the audio file from BytesIO using soundfile
        y, sr = sf.read(audio_io)

        # Ensure the audio_io is seekable
        audio_io.seek(0)

        # Speech recognition for transcription
        recognizer = speech_recog.Recognizer()
    
    try:
        with speech_recog.AudioFile(audio_io) as source:
            audio_data = recognizer.record(source)
            transcription = recognizer.recognize_google(audio_data)
    except speech_recog.UnknownValueError:
        transcription = None
    except ValueError as e:
        print(f"Error reading audio file: {e}")
        transcription = None

    # Calculate pronunciation score
    wer = word_error_rate(reference_text, transcription) if transcription else 1
    pronunciation_score = max(0, (1 - wer)) * 100

    # Calculate fluency score
    duration = librosa.get_duration(y=y, sr=sr)
    num_words = len(y) // 1000  # Placeholder for actual word count
    speech_rate = calculate_speech_rate(num_words, duration)
    long_pauses = analyze_long_pauses(y, sr)
    speech_rate_score = min(speech_rate / 120 * 100, 100)  # Scale to 0-50
    long_pause_score = max(50 - long_pauses * 10, 0)  # Scale down based on long pauses
    # fluency_score = (speech_rate_score + long_pause_score) / 2
    fluency_score = calculate_fluency_score(y, sr, speech_rate, long_pauses)

    # Analyze intonation score
    average_pitch = analyze_intonation(y, sr)
    intonation_score = min(average_pitch / 400 * 100, 100)  # Adjust based on expected pitch range
# Analyze incorrect phonemes
    incorrect_phonemes = analyze_phonemes(reference_text, transcription) if transcription else []
    total_phonemes = len(phonemes_from_text(reference_text))
    phoneme_penalty = calculate_phoneme_penalty(incorrect_phonemes, total_phonemes)

    # Create response data
    response = {
        'transcription': transcription,
        'pronunciation_score': round(pronunciation_score),
        'intonation_score': round(intonation_score),
        'fluency_score': round(fluency_score),
        'incorrect_phonemes': incorrect_phonemes,
        'average_score': (pronunciation_score + intonation_score + fluency_score) / 3,
        'penalty': phoneme_penalty
    }


    print(json.dumps(response))

if __name__ == '__main__':
    reference_text = sys.argv[1]
    main(reference_text)
