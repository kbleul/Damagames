
import React from 'react'
import background from "../assets/backdrop.jpg";

const PrivacyModal = () => {
    return (<article className='text-white text-left mt-2 px-2 h-[100vh] overflow-y-scroll' style={{
        backgroundImage: `url(${background})`,
        minWidth: "100vw",
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
    }}>
        <h1 id="_privacy_policy_for_damagames" className="sect0 text-3xl my-4"><a className="anchor" href="#_privacy_policy_for_damagames"></a>Privacy Policy for Damagames</h1>
        <div className="paragraph">
            <p>Jaktech Engineering and Trading PLC (“Jaktech”, “we”, “us”, “our”) is committed to protecting the privacy of our users (“users”, “you”, “your”) on Damagames.com. This Privacy Policy applies to the progressive web app for multiplayer games of checkers (“Service”) provided on Damagames.com and explains how we collect, use, share, and protect your personal information. By using our Service, you agree to the terms of this Privacy Policy.</p>
        </div>
        <div className="sect1 mb-8">
            <h2 id="_information_we_collect" className="text-xl mt-3"><a className="text-2xl my-4" href="#_information_we_collect"></a>1. Information We Collect</h2>
            <div className="sectionbody">
                <div className="paragraph">
                    <p>We collect information from and about you in a variety of ways:</p>
                </div>
                <div className="olist arabic">
                    <ol className="arabic">
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
            <h2 id="_use_of_information" className="text-xl mt-3"><a className="text-3xl my-4" href="#_use_of_information"></a>2. Use of Information</h2>
            <div className="sectionbody">
                <div className="paragraph">
                    <p>We use the information we collect to provide, maintain, and improve our Service, as well as to personalize your experience and communicate with you. This may include:</p>
                </div>
                <div className="olist arabic">
                    <ol className="arabic pl-[15%] ">
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
            <h2 id="_sharing_of_information" className="text-xl mt-3"><a className="anchor" href="#_sharing_of_information"></a>3. Sharing of Information</h2>
            <div className="sectionbody">
                <div className="paragraph">
                    <p>We may share information about you as follows:</p>
                </div>
                <div className="olist arabic">
                    <ol className="arabic pl-[15%] ">
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
            <h2 id="_data_retention_and_protection" className="text-xl mt-3"><a className="anchor" href="#_data_retention_and_protection"></a>4. Data Retention and Protection</h2>
            <div className="sectionbody">
                <div className="paragraph">
                    <p>We retain your information for as long as necessary to provide the Service, comply with our legal obligations, resolve disputes, and enforce our agreements. We implement appropriate technical and organizational measures to protect the security of your information.</p>
                </div>
            </div>
        </div>
        <div className="sect1 mb-8">
            <h2 id="_your_rights" className="text-xl mt-3" ><a className="anchor" href="#_your_rights"></a>5. Your Rights</h2>
            <div className="sectionbody">
                <div className="paragraph">
                    <p>Under the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), you have certain rights with respect to your personal information, including:</p>
                </div>
                <div className="olist arabic">
                    <ol className="arabic pl-[15%] ">
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
                    <p>To exercise your rights, please contact us at <a href="mailto:support@jaktech.et">support@jaktech.et</a>.</p>
                </div>
            </div>
        </div>
        <div className="sect1 mb-8">
            <h2 id="_changes_to_this_privacy_policy" className="text-xl mt-3"><a className="anchor" href="#_changes_to_this_privacy_policy"></a>6. Changes to This Privacy Policy</h2>
            <div className="sectionbody">
                <div className="paragraph">
                    <p>We may update this Privacy Policy from time to time to reflect changes in our practices or services. If we make any material changes, we will provide notice through the Service or by other means.</p>
                </div>
            </div>
        </div>
        <div className="sect1 mb-8">
            <h2 id="_contact_us"><a className="anchor" href="#_contact_us"></a>7. Contact Us</h2>
            <div className="sectionbody">
                <div className="paragraph">
                    <p>If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:support@jaktech.et">support@jaktech.et</a>.</p>
                </div>
            </div>
        </div>

        <div id="footer">
            <div id="footer-text" className=' text-center w-full mt-8'>
                v1.0.0 |
                Last updated 2023-01-31
            </div>
        </div>
        {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/styles/github.min.css">
                <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/highlight.min.js"></script>
                <script>hljs.initHighlighting()</script> */}
    </article>
    )
}

export default PrivacyModal