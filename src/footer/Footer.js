import React from 'react';
import { hosts } from '../core/utils/fetchRequest';
import Link from '../core/Link';
import './Footer.scss';

const Footer = () => {
  return (
    <div className="Footer-Container">
      <div className="Footer-Icon-Container">
        <Link href="mailto:test@gmail.com">
          <img
            className="Footer-Icon"
            alt="Email"
            src={hosts.MAIN_SERVICE + 'resources/icons/gmailLogo.svg'}
          />
        </Link>
        <Link href="https://twitter.com/CTapply">
          <img
            className="Footer-Icon"
            alt="Twitter"
            src={hosts.MAIN_SERVICE + 'resources/icons/twitterLogo.svg'}
          />
        </Link>
        <Link href="https://github.com/CTapply">
          <img
            className="Footer-Icon"
            alt="Github"
            src={hosts.MAIN_SERVICE + 'resources/icons/githubLogo.svg'}
          />
        </Link>
        <Link href="https://www.linkedin.com/in/cmtapply/">
          <img
            className="Footer-Icon"
            alt="Linked-in"
            src={hosts.MAIN_SERVICE + 'resources/icons/linkedInLogo.svg'}
          />
        </Link>
      </div>
      <div className="Footer-Divider" />
      <p className="Footer-Copywrite">All Materials &#169; Cory Tapply 2021</p>
    </div>
  );
};

export default Footer;
