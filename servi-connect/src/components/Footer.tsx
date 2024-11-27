import { IconGithub, IconLinkedin, IconMedium, IconNpm } from '@/icons'
import { WrapperContentDelimiter } from './Wrappers'

export const Footer = () => {
  return (
    <WrapperContentDelimiter as='div'>
      <footer className='bg-dark text-secondary px-8 py-10 mb-6 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between'>
        <p className='order-1 md:-order-1 text-center md:text-left'>
          &copy; 2024 ServiConnect - developed by Jorge Sigüenza
        </p>
        <div className='flex items-center gap-4'>
          <a
            className='p-3 rounded-full bg-slate-600/40'
            href='https://medium.com/@jorge24abrahan'
            target='_blank'
          >
            <IconMedium />
          </a>
          <a
            className='p-3 rounded-full bg-slate-600/40'
            href='https://www.npmjs.com/~jorge_siguenza'
            target='_blank'
          >
            <IconNpm />
          </a>
          <a
            className='p-3 rounded-full bg-slate-600/40'
            href='https://github.com/jorgeabrahan'
            target='_blank'
          >
            <IconGithub />
          </a>
          <a
            className='p-3 rounded-full bg-slate-600/40'
            href='https://www.linkedin.com/in/jorge-siguenza/?locale=en_US'
            target='_blank'
          >
            <IconLinkedin />
          </a>
        </div>
      </footer>
    </WrapperContentDelimiter>
  )
}
