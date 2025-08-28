import ExchangeCard from "./utils/card";

export default function ExchangePending() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Completed</h2>
      <div className="relative">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <ExchangeCard uc="Álgebra Linear" from="T2" to="T1" completed />
          <ExchangeCard uc="Análise Matemática" from="TP2" to="TP4" completed />
          <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-20 bg-gradient-to-l from-white via-white/80 to-transparent md:hidden"></div>
        </div>
      </div>
      {/*<span>Nenhuma troca enviada por concluir.</span>*/}
    </div>
  );
}
