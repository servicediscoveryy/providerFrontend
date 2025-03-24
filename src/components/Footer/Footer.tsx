import FooterColumn from "./FooterColumn";
import { Facebook, Github, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-200   py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="bg-black text-white p-2 rounded">
                <span className="font-bold text-lg">SC</span>
              </div>
              <span className="ml-2 text-xl font-semibold">Skill Connect</span>
            </div>
          </div>

          {/** Company Section **/}
          <FooterColumn
            title="Company"
            links={[
              { text: "About us", href: "#" },
              { text: "Terms & conditions", href: "#" },
              { text: "Privacy policy", href: "#" },
            ]}
          />

          {/** Customers Section **/}
          <FooterColumn
            title="For customers"
            links={[
              { text: "UC reviews", href: "#" },
              { text: "Categories near you", href: "#" },
              { text: "Blog", href: "#" },
              { text: "Contact us", href: "#" },
            ]}
          />

          {/** Partners Section **/}
          <FooterColumn
            title="For partners"
            links={[{ text: "Register as a professional", href: "#" }]}
          />

          {/** Social Links Section **/}
          <div className="w-full md:w-1/4">
            <h3 className="text-lg font-semibold mb-4">Social links</h3>
            <div className="flex space-x-4 mb-4">
              <a className="text-gray-600 hover:text-black">
                <Facebook />
              </a>
              <a className="text-gray-600 hover:text-black">
                <Instagram />
              </a>
              <a className="text-gray-600 hover:text-black">
                <Github />
              </a>
              <a className="text-gray-600 hover:text-black">
                <Linkedin />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-gray-600 text-sm">
          © Copyright 2024 Skill Connects. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
