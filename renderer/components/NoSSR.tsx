import dynamic from 'next/dynamic'
import React, { FC } from 'react'

interface Props {
  children: any;
}

const NoSSR: FC<Props> = ({ children }) => (
  <React.Fragment>{children}</React.Fragment>
);

export default dynamic(() => Promise.resolve(NoSSR), {
  ssr: false
});