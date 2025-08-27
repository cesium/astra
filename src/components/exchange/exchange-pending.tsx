import ExchangeCard from "./utils/exchange-card";

export default function ExchangePending() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Pending</h2>
      <div className="relative">
        <div className="no-scrollbar flex md:flex-wrap gap-2 overflow-x-auto md:overflow-x-hidden">
          <ExchangeCard
            uc="Álgebra Linear"
            from="T2"
            to="T1"
            pending
            state="waiting"
          />
          <ExchangeCard
            uc="Análise Matemática"
            from="TP2"
            to="TP4"
            pending
            state="found"
          />{" "}
          <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-20 bg-gradient-to-l from-white via-white/80 to-transparent md:hidden"></div>
        </div>
      </div>
      {/*<span>Nenhuma troca enviada por concluir.</span>*/}
    </div>
  );
}
