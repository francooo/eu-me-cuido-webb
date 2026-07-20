import React, { useEffect } from 'react';

/**
 * Modal — casca de diálogo compartilhada e mobile-first.
 *
 * Comportamento:
 *  - No mobile renderiza como "bottom-sheet" (ancorado embaixo, cantos superiores
 *    arredondados, animação de baixo pra cima) e a partir de `sm:` como diálogo
 *    centralizado — preservando o visual desktop atual.
 *  - Sempre limita a altura (`max-h-[92dvh]`) e rola o conteúdo interno, então
 *    formulários altos nunca cortam os botões de ação.
 *  - Respeita a safe-area do iOS (padding inferior via env(safe-area-inset-bottom)).
 *  - Fecha no clique do backdrop e na tecla Escape; trava o scroll do body enquanto aberto.
 *
 * Props:
 *  - open       (bool)   controla a visibilidade
 *  - onClose    (fn)     chamado ao fechar (backdrop, botão X, Escape)
 *  - title      (string) título opcional no cabeçalho
 *  - subtitle   (string) subtítulo/eyebrow opcional
 *  - icon       (string) nome do Material Symbol opcional (ex: "smart_toy")
 *  - size       ('md'|'lg') largura máxima no desktop (default 'lg')
 *  - children   conteúdo rolável (inclui formulário e botões de ação)
 */
const SIZES = {
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
};

const Modal = ({ open, onClose, title, subtitle, icon, size = 'lg', children }) => {
  // Trava o scroll do body e escuta a tecla Escape enquanto o modal está aberto.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const hasHeader = title || subtitle || icon;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`bg-surface-container-lowest w-full ${SIZES[size] || SIZES.lg} max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto rounded-t-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-8 shadow-2xl border border-outline-variant/15 flex flex-col gap-6 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200`}
      >
        {hasHeader && (
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {icon && (
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <span className="material-symbols-outlined text-3xl">{icon}</span>
                </div>
              )}
              <div className="min-w-0">
                {title && (
                  <h3 className="text-xl sm:text-2xl font-black text-on-surface tracking-tighter truncate">{title}</h3>
                )}
                {subtitle && (
                  <p className="text-xs uppercase font-bold text-primary tracking-widest mt-1 truncate">{subtitle}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="tap-target shrink-0 w-11 h-11 -mr-1 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-all text-on-surface-variant active:scale-90"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
