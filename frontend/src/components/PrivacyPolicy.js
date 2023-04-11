
import React, { useState } from 'react'
import background from "../assets/backdrop.jpg";
import { useNavigate } from "react-router-dom";
import PrivatePolicyModal from "../Game/components/PrivatePolicyModal";

const PrivacyPolicy = () => {
    const [isPrivacyModalOpen, set_isPrivateModalOpen] = useState(false)

    return (<><article className='leading-6  text-gray-100 text-left mt-2 px-2 pr-4 h-[100vh] overflow-y-scroll' style={{
        backgroundImage: `url(${background})`,
        minWidth: "100vw",
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
    }}>

        <button
            className="z-10 bg-orange-color rounded-full w-8 h-8 flex justify-center items-center mr-2 mt-2 fixed left-0 top-[40vh]"
            onClick={() => set_isPrivateModalOpen(true)}
        >
            <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.396166 0.973833C0.500244 0.722555 0.676505 0.507786 0.902656 0.356693C1.12881 0.205599 1.39469 0.124969 1.66667 0.125H10.8333C12.6567 0.125 14.4054 0.849328 15.6947 2.13864C16.984 3.42795 17.7083 5.17664 17.7083 7C17.7083 8.82336 16.984 10.572 15.6947 11.8614C14.4054 13.1507 12.6567 13.875 10.8333 13.875H2.58333C2.21866 13.875 1.86892 13.7301 1.61106 13.4723C1.3532 13.2144 1.20833 12.8647 1.20833 12.5C1.20833 12.1353 1.3532 11.7856 1.61106 11.5277C1.86892 11.2699 2.21866 11.125 2.58333 11.125H10.8333C11.9274 11.125 12.9766 10.6904 13.7501 9.91682C14.5237 9.14323 14.9583 8.09402 14.9583 7C14.9583 5.90598 14.5237 4.85677 13.7501 4.08318C12.9766 3.3096 11.9274 2.875 10.8333 2.875H4.98592L5.84758 3.73667C6.09793 3.99611 6.23636 4.34351 6.23306 4.70403C6.22976 5.06455 6.08499 5.40935 5.82993 5.66417C5.57487 5.91898 5.22994 6.06343 4.86941 6.06639C4.50889 6.06935 4.16163 5.93059 3.90242 5.68L0.694083 2.47167C0.501936 2.27941 0.371084 2.03451 0.318058 1.76791C0.265033 1.50132 0.292214 1.22499 0.396166 0.973833Z"
                    fill="#191921"
                />
            </svg>
        </button>


        <h1 id="_privacy_policy_for_damagames" className="sect0 text-3xl my-4 text-center text-orange-color"><a className="anchor" href="#_privacy_policy_for_damagames"></a>Privacy Policy for Damagames</h1>
        <div className="paragraph">
            <p>Jaktech Engineering and Trading PLC (“Jaktech”, “we”, “us”, “our”) is committed to protecting the privacy of our users (“users”, “you”, “your”) on
                <span className='text-orange-color'> Damagames.com</span> . This Privacy Policy applies to the progressive web app for multiplayer games of checkers (“Service”) provided on Damagames.com and explains how we collect, use, share, and protect your personal information. By using our Service, you agree to the terms of this Privacy Policy.</p>
        </div>
        <div className="sect1 mb-8">
            <h2 id="_information_we_collect" className="text-2xl mt-6 mb-3 text-orange-color "><a className="text-2xl my-4 " href="#_information_we_collect"></a>1. Information We Collect</h2>
            <div className="sectionbody">
                <div className="paragraph">
                    <p>We collect information from and about you in a variety of ways:</p>
                </div>
                <div className="olist arabic">
                    <ol className="arabic list-disc">
                        <li>
                            <p>Information you provide directly to us: When you sign up for and use our Service, you may provide us with information such as your name, email address, and password.</p>
                        </li>
                        <li>
                            <p>Information we collect automatically: When you use our Service, we may automatically collect information about your device type and operating system, device ID, IP address, browser type, and usage information.</p>
                        </li>
                        <li>
                            <p>Information from third-party sources: We may receive information about you from third-party sources, such as social media platforms, to personalize your experience and improve our Service.</p>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
        <div className="sect1 mb-8">
            <h2 id="_use_of_information" className="text-2xl mt-6 mb-3 text-orange-color"><a className="text-3xl my-4" href="#_use_of_information"></a>2. Use of Information</h2>
            <div className="sectionbody">
                <div className="paragraph">
                    <p>We use the information we collect to provide, maintain, and improve our Service, as well as to personalize your experience and communicate with you. This may include:</p>
                </div>
                <div className="olist arabic">
                    <ol className="arabic list-disc pl-[15%] ">
                        <li>
                            <p>Providing customer support</p>
                        </li>
                        <li>
                            <p>Personalizing content and experiences</p>
                        </li>
                        <li>
                            <p>Analyzing and improving our Service</p>
                        </li>
                        <li>
                            <p>Communicating with you about products, services, and promotions</p>
                        </li>
                        <li>
                            <p>Preventing and detecting fraud or abuse</p>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
        <div className="sect1 mb-8">
            <h2 id="_sharing_of_information" className="text-2xl mt-6 mb-3 text-orange-color"><a className="anchor" href="#_sharing_of_information"></a>3. Sharing of Information</h2>
            <div className="sectionbody">
                <div className="paragraph">
                    <p>We may share information about you as follows:</p>
                </div>
                <div className="olist arabic">
                    <ol className="arabic list-disc pl-[15%] ">
                        <li>
                            <p>With third-party service providers: We may share information with third-party service providers to provide, maintain, and improve our Service.</p>
                        </li>
                        <li>
                            <p>For legal reasons: We may share information about you if we believe it is necessary to comply with the law or to protect the rights, property, or safety of Jaktech, our users, or others.</p>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
        <div className="sect1 mb-8">
            <h2 id="_data_retention_and_protection" className="text-2xl mt-6 mb-3 text-orange-color"><a className="anchor" href="#_data_retention_and_protection"></a>4. Data Retention and Protection</h2>
            <div className="sectionbody">
                <div className="paragraph">
                    <p>We retain your information for as long as necessary to provide the Service, comply with our legal obligations, resolve disputes, and enforce our agreements. We implement appropriate technical and organizational measures to protect the security of your information.</p>
                </div>
            </div>
        </div>
        <div className="sect1 mb-8">
            <h2 id="_your_rights" className="text-2xl mt-6 mb-3 text-orange-color" ><a className="anchor" href="#_your_rights"></a>5. Your Rights</h2>
            <div className="sectionbody">
                <div className="paragraph">
                    <p>Under the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), you have certain rights with respect to your personal information, including:</p>
                </div>
                <div className="olist arabic">
                    <ol className="arabic list-decimal pl-[15%] ">
                        <li>
                            <p>The right to access your information</p>
                        </li>
                        <li>
                            <p>The right to request the correction or deletion of your information</p>
                        </li>
                        <li>
                            <p>The right to request that we stop using or collecting your information</p>
                        </li>
                    </ol>
                </div>
                <div className="paragraph">
                    <p>To exercise your rights, please contact us at <span className="text-orange-color"><a href="mailto:support@jaktech.et">support@jaktech.et</a></span>.</p>
                </div>
            </div>
        </div>
        <div className="sect1 mb-8">
            <h2 id="_changes_to_this_privacy_policy" className="text-2xl mt-6 mb-3 text-orange-color"><a className="anchor" href="#_changes_to_this_privacy_policy"></a>6. Changes to This Privacy Policy</h2>
            <div className="sectionbody">
                <div className="paragraph">
                    <p>We may update this Privacy Policy from time to time to reflect changes in our practices or services. If we make any material changes, we will provide notice through the Service or by other means.</p>
                </div>
            </div>
        </div>
        <div className="sect1 mb-8">
            <h2 id="_contact_us" className="text-2xl mt-6 mb-3 text-orange-color"><a className="anchor" href="#_contact_us"></a>7. Contact Us</h2>
            <div className="sectionbody">
                <div className="paragraph">
                    <p>If you have any questions or concerns about this Privacy Policy, please contact us at <span className="text-orange-color"><a href="mailto:support@jaktech.et">support@jaktech.et</a></span>.</p>
                </div>
            </div>
        </div>

        <div id="footer">
            <div id="footer-text" className=' text-center w-full mt-8 text-xs'>
                v1.0.0 |
                Last updated 2023-01-31
            </div>
        </div>
    </article>

        <PrivatePolicyModal
            isPrivacyModalOpen={isPrivacyModalOpen}
            set_isPrivateModalOpen={set_isPrivateModalOpen}
        />
    </>
    )
}

export default PrivacyPolicy