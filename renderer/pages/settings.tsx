import { FC, useEffect } from "react";
import themes from "../lib/themes";
import { useAtom } from "jotai";
import * as atoms from  "../lib/atoms";

interface Props {
}

const SettingsPage: FC<Props> = ({}) => {
  const [theme, setTheme] = useAtom(atoms.theme);
  const [darkModeTheme, setDarkModeTheme] = useAtom(atoms.darkModeTheme);
  const [, setConversations] = useAtom(atoms.conversations);
  const [, setActiveConversationMessages] = useAtom(atoms.activeConversationMessages);
  const [, setActiveConversationId] = useAtom(atoms.activeConversationId);
  const [systemPrompt, setSystemPrompt] = useAtom(atoms.systemPrompt);

  const resetStorage = () => {
    localStorage.clear();
    setConversations({});
    setActiveConversationId("");
    setActiveConversationMessages([]);
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">Settings</h1>
      <hr/>

      <div className="grid gap-2 mt-4 grid-cols-[30%_70%] p-4">
        <div>Flush Local Storage</div>
        <div><button className="btn btn-secondary btn-sm" onClick={() => { if(confirm("Are you sure?")){ resetStorage() }}}>Flush</button></div>

        <div>Light Mode Theme</div>
        <div>
          <select className="select select-bordered w-full max-w-xs theme-controller" value={theme} onChange={(ev) => setTheme(ev.target.value)}>
            {themes.map((theme_option) => (
              <option className="" key={theme_option} value={theme_option}>{theme_option}</option>
            ))}
          </select>
        </div>

        <div>Dark Mode Theme</div>
        <div>
          <select className="select select-bordered w-full max-w-xs theme-controller" value={darkModeTheme} onChange={(ev) => setDarkModeTheme(ev.target.value)}>
            {themes.map((theme_option) => (
              <option className="" key={theme_option} value={theme_option}>{theme_option}</option>
            ))}
          </select>
        </div>

        <div>System Prompt</div>
        <div>
          <textarea className="textarea textarea-bordered w-full" placeholder="System Prompt" onChange={(e) => setSystemPrompt(e.target.value)}>{systemPrompt}</textarea>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage