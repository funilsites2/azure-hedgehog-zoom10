// ...imports permanecem iguais

const MENU_ITEMS = [
  // { key: "continuar", label: "Continuar", icon: Play },  // removido
  { key: "modulos", label: "Módulos", icon: BookOpen },
  { key: "progresso", label: "Progresso", icon: BarChart2 },
  { key: "conquistas", label: "Conquistas", icon: Award },
  { key: "bloqueados", label: "Bloqueados", icon: Lock },
] as const;

// ...

// No render do sidebar móvel, replace isto:
{/* {MENU_ITEMS.map((item) => ( */}
// por isto:
{MENU_ITEMS.map((item) => (

// E no footer móvel, faça o mesmo filter:
{/* {MENU_ITEMS.map((item) => ( */}
// por:
{MENU_ITEMS.map((item) => ()

// Se ainda surgir o “continuar” em alguma outra lista, filtre:
{MENU_ITEMS.filter(item => item.key !== "continuar").map((item) => (
  <button
    key={item.key}
    onClick={() => {
      setMobileTab(item.key);
      if (item.key === "modulos") setModuloSelecionado(null);
    }}
    className={`flex items-center gap-3 px-4 py-3 w-full text-neutral-300 rounded ${
      mobileTab === item.key
        ? "bg-green-600 text-white"
        : "hover:bg-green-600 hover:text-white"
    }`}
  >
    <item.icon size={20} className="text-green-500" />
    <span>{item.label}</span>
  </button>
))}

// ...restante do arquivo permanece igual