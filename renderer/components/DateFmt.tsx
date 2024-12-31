import { FC } from "react";

interface Props {
  date: Date
  format?: string
  className?: string
}

const DateFmt: FC<Props> = ({ date, format, className }) => {
  const dt = new Date(date);
  //default format to short
  if (format === undefined) {
    format = "short"
  }
  let dateOutput = dt.toLocaleDateString("en-US", { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  if(format === "short"){
    // done!
  }
  return <span className={className}>{dateOutput}</span>
}

export default DateFmt;