import React, { FC } from 'react'

interface Props {
}

const HomePage: FC<Props> = ({ }) => {
  
  // layout should be a left-hand nav panel, that also shows the conversations from appstate in a scrollable list below the home and settings links. To the right of the nav panel is a full-screen chat window, with a new chat input below the message history.
  return (
    <div>
      Start a new conversation!
    </div>
  )
}

export default HomePage;