import React, { useState } from 'react';
import { SOCIAL_LINKS } from '../constants';
import { CursorContextType } from '../types';

interface Props {
  setCursorVariant: CursorContextType['setCursorVariant'];
}

const ContactPage: React.FC<Props> = ({ setCursorVariant }) => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData(e.currentTarget);
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      console.error('Web3Forms access key is missing');
      setStatus('error');
      return;
    }

    formData.append('access_key', accessKey);
    formData.append('subject', 'New Contact from Portfolio');
    formData.append('from_name', 'Renish Portfolio');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        console.error('Error submitting form', data);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Error submitting form', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section className="py-32 px-6 md:px-20 relative overflow-hidden min-h-[80vh] flex items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/10 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center gap-12">
            
            {/* Top - Text */}
            <div className="w-full text-center flex flex-col items-center">
                <h2 className="text-xs font-mono text-yellow-500 tracking-[0.2em] uppercase mb-4 animate-pulse">
                    Initiate Connection
                </h2>
                <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                    Let's Build <br className="hidden md:block"/> Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Impossible</span>.
                </h2>
                <p className="text-gray-400 mb-8 text-lg max-w-xl mx-auto leading-relaxed border-l-2 border-yellow-500/50 pl-4">
                    I'm currently available for freelance work, open source collaboration, and internship opportunities.
                </p>

                <div className="flex flex-row gap-8 text-sm text-gray-500 font-mono mt-4">
                    <div>
                        <span className="text-yellow-500 mr-2">&gt;</span> EMAIL: 
                        <a href={`mailto:${SOCIAL_LINKS.email}`} className="ml-2 text-gray-300 hover:text-white transition-colors" onMouseEnter={() => setCursorVariant('button')} onMouseLeave={() => setCursorVariant('default')}>{SOCIAL_LINKS.email}</a>
                    </div>
                    <div className="hidden sm:block">
                        <span className="text-yellow-500 mr-2">&gt;</span> GITHUB: 
                        <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" className="ml-2 text-gray-300 hover:text-white transition-colors" onMouseEnter={() => setCursorVariant('button')} onMouseLeave={() => setCursorVariant('default')}>renish-1111</a>
                    </div>
                </div>
            </div>

            {/* Bottom - Form */}
            <div className="w-full max-w-2xl">
                <div className="relative group/spotlight w-full">
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-transparent to-transparent rounded-2xl z-0 opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100 pointer-events-none" style={{
                        background: 'radial-gradient(circle 300px at var(--x) var(--y), rgba(250, 204, 21, 0.4), transparent 80%)'
                    }}></div>

                    <form 
                        onSubmit={handleSubmit} 
                        className="relative flex flex-col gap-6 text-left w-full mx-auto bg-[#0a0a0a] rounded-2xl p-8 sm:p-10 z-10 shadow-2xl"
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            if (e.currentTarget.parentElement) {
                                e.currentTarget.parentElement.style.setProperty('--x', `${x}px`);
                                e.currentTarget.parentElement.style.setProperty('--y', `${y}px`);
                            }
                        }}
                    >
                        {/* Spam Protection */}
                        <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="name" className="text-xs font-mono tracking-widest text-yellow-500/80 ml-1 uppercase">Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    id="name"
                                    required 
                                    placeholder="John Doe"
                                    className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all hover:border-white/20"
                                    onMouseEnter={() => setCursorVariant('text')}
                                    onMouseLeave={() => setCursorVariant('default')}
                                />
                            </div>
                            
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="email" className="text-xs font-mono tracking-widest text-yellow-500/80 ml-1 uppercase">Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    id="email"
                                    required 
                                    placeholder="john@example.com"
                                    className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all hover:border-white/20"
                                    onMouseEnter={() => setCursorVariant('text')}
                                    onMouseLeave={() => setCursorVariant('default')}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="message" className="text-xs font-mono tracking-widest text-yellow-500/80 ml-1 uppercase">Message</label>
                            <textarea 
                                name="message" 
                                id="message"
                                required 
                                rows={5}
                                placeholder="Tell me about your project..."
                                className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all hover:border-white/20 resize-none"
                                onMouseEnter={() => setCursorVariant('text')}
                                onMouseLeave={() => setCursorVariant('default')}
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={status === 'submitting'}
                            className="mt-2 w-full py-4 bg-transparent border border-yellow-500 text-yellow-500 rounded-xl text-sm uppercase tracking-widest font-bold hover:bg-yellow-500 hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] flex justify-center items-center group relative overflow-hidden"
                            onMouseEnter={() => setCursorVariant('button')}
                            onMouseLeave={() => setCursorVariant('default')}
                        >
                            <span className="relative z-10">{status === 'submitting' ? 'Transmitting...' : 'Send Message'}</span>
                            <div className="absolute inset-0 bg-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out z-0"></div>
                        </button>

                        {status === 'success' && (
                            <p className="text-green-400 text-sm text-center mt-2 font-mono">Transmission successful. Awaiting reply.</p>
                        )}
                        {status === 'error' && (
                            <p className="text-red-400 text-sm text-center mt-2 font-mono">Transmission failed. Check connection.</p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    </section>
  );
};

export default ContactPage;
