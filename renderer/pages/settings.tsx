import { FC, useEffect } from "react";
import themes from "../lib/themes";
import { useAtom } from "jotai";
import * as atoms from  "../lib/atoms";
import NoSSR from "../components/NoSSR";

interface Props {
}

const SettingsPage: FC<Props> = ({}) => {
  const [theme, setTheme] = useAtom(atoms.theme);
  const [darkModeTheme, setDarkModeTheme] = useAtom(atoms.darkModeTheme);
  const [, setConversations] = useAtom(atoms.conversations);
  const [, setActiveConversationMessages] = useAtom(atoms.activeConversationMessages);
  const [, setActiveConversationId] = useAtom(atoms.activeConversationId);
  const [systemPrompt, setSystemPrompt] = useAtom(atoms.systemPrompt);
  const [userName, setUserName] = useAtom(atoms.userName);

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

      <NoSSR>

        <div className="grid gap-2 mt-4 grid-cols-[30%_70%] p-4">

          <div>User Name</div>
          <div>
            <input type="text" placeholder="User Name" className="input input-bordered w-full max-w-xs" value={userName} onChange={(e) => setUserName(e.target.value)} />
          </div>

          <div>Light Mode Theme</div>
          <div>
            <select className="select select-bordered w-full max-w-xs theme-controller" value={theme} onChange={(ev) => setTheme(ev.target.value)}>
              {themes.filter((t) => !t.isDark).map((theme_option) => (
                <option className="" key={theme_option.name} value={theme_option.name}>{theme_option.name}</option>
              ))}
            </select>
          </div>

          <div>Dark Mode Theme</div>
          <div>
            <select className="select select-bordered w-full max-w-xs theme-controller" value={darkModeTheme} onChange={(ev) => setDarkModeTheme(ev.target.value)}>
              {themes.filter((t) => t.isDark).map((theme_option) => (
                <option className="" key={theme_option.name} value={theme_option.name}>{theme_option.name}</option>
              ))}
            </select>
          </div>

          <div>System Prompt</div>
          <div>
            <textarea className="textarea textarea-bordered w-full" placeholder="System Prompt" onChange={(e) => setSystemPrompt(e.target.value)}>{systemPrompt}</textarea>
          </div>

          <div className="text-error font-bold">⚠️ Danger Zone</div>
          <div className="bg-error bg-opacity-10 p-4 rounded-lg">
            <div className="mb-2">Flush Local Storage</div>
            <button className="btn btn-error btn-sm" onClick={() => { if (confirm("Are you sure? This action cannot be undone.")) { resetStorage() } }}>Flush</button>
          </div>
        </div>
      </NoSSR>
    </div>
  );
};

export default SettingsPage