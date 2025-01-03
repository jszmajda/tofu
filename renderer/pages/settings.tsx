import { FC, useEffect } from "react";
import themes from "../lib/themes";
import { useAtom } from "jotai";
import * as atoms from  "../lib/atoms";

interface Props {
}

const SettingsPage: FC<Props> = ({}) => {
  const [theme, setTheme] = useAtom(atoms.theme);
  const [, setConversations] = useAtom(atoms.conversations);
  const [, setActiveConversationMessages] = useAtom(atoms.activeConversationMessages);
  const [, setActiveConversationId] = useAtom(atoms.activeConversationId);

  useEffect(() => {
    document.querySelector('html').setAttribute('data-theme', theme);
  }, [theme])

  const resetStorage = () => {
    localStorage.clear();
    setConversations({});
    setActiveConversationId("");
    setActiveConversationMessages([]);
  }

  return (
    <div>
      <h1 className="text-lg font-bold">Settings</h1>
      <hr/>

      <div className="grid gap-2 mt-4 grid-cols-[30%_70%]">
        <div>Flush Local Storage</div>
        <div><button className="btn btn-secondary btn-sm" onClick={() => { if(confirm("Are you sure?")){ resetStorage() }}}>Flush</button></div>

        <div>Change Theme</div>
        <div>
          <select className="select select-bordered w-full max-w-xs theme-controller" value={theme} onChange={(ev) => setTheme(ev.target.value)}>
            {themes.map((theme_option) => (
              <option className="" key={theme_option} value={theme_option}>{theme_option}</option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage