import { IconBrandGithub, IconBrandTwitter } from "@tabler/icons-react";
import { FC } from "react";

export const Footer: FC = () => {
  return (
    <div className="footer-section">
      <div className="back-to-top-container">
        <button className="back-to-top before:w-16 before:h-16" onClick={() => window.scrollTo(0, 0)}><span>Back to top</span></button>
      </div>
      <ul className="footer-list">
        <li className="footer-list-item">
          <a href="https://www.paddypower.com/aboutUs/Privacy.Policy/" target="_blank" className="footer-link">Privacy
            Policy</a>
        </li>
        <li className="footer-list-item">
          <a href="https://www.paddypower.com/en/aboutUs/Terms.and.Conditions/" target="_blank"
             className="footer-link">Terms &amp; Conditions</a>
        </li>
        <li className="footer-list-item">
          <a href="https://www.paddypower.com/aboutUs/Cookie.Policy/" target="_blank" className="footer-link">Cookie
            Policy</a>
        </li>
        <li className="footer-list-item">
          <a href="https://helpcenter.paddypower.com/app/answers/detail/p/6/a_id/70" target="_blank"
             className="footer-link">Underage gambling is an offence</a>
        </li>
        <li className="footer-list-item">
          <a href="https://www.paddypower.com/en/aboutUs/Betting.Rules/" target="_blank"
             className="footer-link">Rules &amp; Regulations</a>
        </li>
        <li className="footer-list-item">
          <a href="https://www.paddypower.com/bet" className="footer-link">PaddyPower.com</a>
        </li>
        <li className="footer-list-item">
          <a href="https://responsiblegaming.paddypower.com/" target="_blank" className="footer-link">Gambling can be
            addictive, use our online tools for a safer way to play</a>
        </li>
      </ul>
    </div>
  );
};
