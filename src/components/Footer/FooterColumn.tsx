import React from "react";

interface FooterColumnProps {
  title: string;
  links: { href: string; text: string }[];
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, links }) => {
  return (
    <div className="w-full md:w-1/4 mb-6 md:mb-0">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ul>
        {links.map((link, index) => (
          <li key={index} className="mb-2">
            <a className="text-gray-600 hover:text-black" href={link.href}>
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterColumn;
