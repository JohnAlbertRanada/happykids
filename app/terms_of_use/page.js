"use client"

import { useRouter } from "next/navigation";
import { PiArrowLeftBold } from "react-icons/pi";

export default function TermsOfUse() {

  const router = useRouter()

  const terms = `
  Terms of Use
          
  Welcome to Happy Kids, a platform designed to support Grade 4 students of San Gregorio Elementary School in developing their English language skills. By accessing or using this website, you agree to comply with the following Terms of Use. If you do not agree to these terms, please refrain from using the website.
          
  1. Use of the Website
    1.1 The website is intended for educational purposes only, focusing on the development of English skills for Grade 4 students.
    1.2 You may use the website for personal, non-commercial purposes. Any unauthorized commercial use is prohibited.
    1.3 Users are expected to use the website responsibly, without disrupting the learning experience for others.
      
  2. User Accounts and Registration
    2.1 To access certain features of the website, you may need to register an account. You are responsible for keeping your login credentials confidential.
    2.2 All information provided during registration must be accurate and up-to-date.
    2.3 The website reserves the right to terminate or suspend your account if you violate any of the Terms of Use.

  3. Content and Intellectual Property
    3.1 All content on the website, including lessons, exercises, and other materials, is the intellectual property of Happy Kids or its licensors.
    3.2 Users may not copy, reproduce, distribute, or create derivative works from the content without express permission.
    3.3 The website may contain links to external sites, which are not under our control. We are not responsible for the content or practices of these external sites.

  4. Limitation of Liability
    4.1 The website is provided "as is," and we make no guarantees regarding its availability, accuracy, or reliability.
    4.2 We are not liable for any direct or indirect damages arising from your use of the website, including loss of data or interruptions in service.

  5. Changes to the Terms of Use
    5.1 We reserve the right to modify these Terms of Use at any time. Any changes will be effective immediately upon posting on the website.
    5.2 It is your responsibility to review the Terms of Use periodically. Continued use of the website constitutes acceptance of any revised terms.

  6. Contact Information
    If you have any questions or concerns about these Terms of Use, please contact us at happykids@gmail.com
  `
  return (
    <div className="w-full h-dvh bg-cover bg-center bg-[url('/images/background_image_v2.png')] flex flex-col relative bg-black">
      <div className="p-10 whitespace-pre w-2/3 mx-auto h-full bg-white text-black text-wrap overflow-y-scroll">
        <button className="w-fit h-fit outline-none border-none bg-transparent" onClick={() => router.back()}>
          <PiArrowLeftBold color="black" size={20} />
        </button>
          {terms}
      </div>
    </div>
  );
}
