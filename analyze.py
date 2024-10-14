import sys
import numpy as np
import io
import soundfile as sf
import librosa
import speech_recognition as speech_recog
import json
from pydub import AudioSegment
from pydub import effects

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

def main(reference_text):
    # Read audio data from stdin
    audio_data = sys.stdin.buffer.read()

    # Convert audio buffer to AudioSegment
    audio = AudioSegment.from_file(io.BytesIO(audio_data))
    audio = audio.set_frame_rate(16000)
    audio = audio.set_channels(1)
    audio = effects.normalize(audio)  # Normalize audio to reduce noise
    audio = audio.low_pass_filter(3000)  # Apply low pass filter to remove high-frequency noise
    audio = audio.set_sample_width(2)

    # Export the audio to a BytesIO object for in-memory processing
    audio_io = io.BytesIO()
    audio.export(audio_io, format='wav')
    audio_io.seek(0)  # Set the pointer to the start of the audio data

    # Load the audio file from BytesIO
    y, sr = sf.read(audio_io)

    # Ensure the audio_io is seekable
    audio_io.seek(0)

    # Speech recognition for transcription
    recognizer = speech_recog.Recognizer()
    with speech_recog.AudioFile(audio_io) as source:
        audio_data = recognizer.record(source)
        try:
            transcription = recognizer.recognize_google(audio_data)
        except speech_recog.UnknownValueError:
            transcription = None

    # Calculate pronunciation score
    wer = word_error_rate(reference_text, transcription) if transcription else 1
    pronunciation_score = max(0, (1 - wer)) * 100

    # Calculate fluency score
    duration = librosa.get_duration(y=y, sr=sr)
    num_words = len(y) // 1000  # Placeholder for actual word count
    speech_rate = calculate_speech_rate(num_words, duration)
    long_pauses = analyze_long_pauses(y, sr)
    speech_rate_score = min(speech_rate / 120 * 50, 50)  # Scale to 0-50
    long_pause_score = max(50 - long_pauses * 10, 0)  # Scale down based on long pauses
    fluency_score = (speech_rate_score + long_pause_score) / 2

    # Analyze intonation score
    average_pitch = analyze_intonation(y, sr)
    intonation_score = min(average_pitch / 400 * 100, 100)  # Adjust based on expected pitch range

    # Create response data
    response = {
        'transcription': transcription,
        'pronunciation_score': round(pronunciation_score),
        'intonation_score': round(intonation_score),
        'fluency_score': round(fluency_score)
    }

    print(json.dumps(response))

if __name__ == '__main__':
    reference_text = sys.argv[1]
    main(reference_text)
