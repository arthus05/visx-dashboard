import { ReactNode } from 'react'
import { Header } from '../../components';

interface IProps {
  children: ReactNode;
}

const Default = ({ children }: IProps) => {
  return (
    <>
      <Header />

      <main>
        { children }
      </main>
    </>
  )
}

export default Default