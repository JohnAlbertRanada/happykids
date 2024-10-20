export default function PrivacyPolicy() {

  const privacy = `
  Privacy Policy for Happy Kids
          
  At Happy Kids, accessible from Grade 4 students of San Gregorio, your privacy is of utmost importance to us. This Privacy Policy outlines the types of personal information we collect, how we use it, and your rights regarding that information.
          
  1.Information We Collect We may collect the following types of information:
      • Personal Information: When you register on our website, we may ask for your name and email address
      
  2. How We Use Your Information
      • We use the information we collect for various purposes, including:
      • To provide and maintain our website.
      • To notify you about changes to our website.
      • To allow you to participate in interactive features when you choose to do so.
      • To provide customer support.
      • To gather analysis or valuable information so that we can improve our website.
      • To monitor the usage of our website.

  3. Disclosure of Your Information
      • We will not share your personal information with third parties except in the following situations:
      • With Your Consent: We may share your information if you give us your consent to do so.
      • Legal Requirements: We may disclose your personal information if required to do so by law or in response to valid requests by public authorities.

  4. Data Security
    The security of your data is important to us, and we strive to implement and maintain reasonable, commercially acceptable security procedures and practices appropriate to the nature of the information we store to protect it from unauthorized access, destruction, use, modification, or disclosure.

  5. Children’s Privacy
    Our website is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us.

  6. Your Rights
    Depending on your location, you may have the following rights regarding your personal information:
      • The right to access your personal information.
      • The right to request correction of your personal information.
      • The right to request deletion of your personal information.
      • The right to object to the processing of your personal information.
    
  7. Changes to This Privacy Policy
    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top of this Privacy Policy.

  8. Contact Us
    If you have any questions about this Privacy Policy, please contact us:

    By email: happykids@gmail.com

  `
  return (
    <div className="w-full h-dvh bg-cover bg-center bg-[url('/images/background_image_v2.png')] flex flex-col relative bg-black">
      <div className="p-10 whitespace-pre w-2/3 mx-auto h-full bg-white text-black text-wrap overflow-y-scroll">
          {privacy}
      </div>
    </div>
  );
}
