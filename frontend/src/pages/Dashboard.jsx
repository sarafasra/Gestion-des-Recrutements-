
import { useContext } from 'react'
import { Users, CalendarDays, UserCheck, Clock3, LayoutDashboard, BriefcaseBusiness, Settings, Bell, Search, ArrowUpRight } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import AdminHeader from '../components/AdminHeader'

const stats = [
  {
    title: 'Total candidats',
    value: '0',
    detail: 'Profils enregistrés',
    icon: Users,
    color: 'bg-violet-100 text-violet-600',
  },
  {
    title: 'Entretiens planifiés',
    value: '0',
    detail: 'Entretiens à venir',
    icon: CalendarDays,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    title: 'Candidats retenus',
    value: '0',
    detail: 'Recrutements validés',
    icon: UserCheck,
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'En attente',
    value: '0',
    detail: 'Dossiers à traiter',
    icon: Clock3,
    color: 'bg-sky-100 text-sky-600',
  },
]

function Dashboard() {
  const { user } = useContext(AuthContext)

  return (
    <>
      {user?.role === 'admin' && <AdminHeader />}
      <div className="min-h-screen bg-slate-50 text-slate-800 md:flex">
      <aside className="flex w-full flex-col bg-white px-5 py-6 shadow-sm md:min-h-screen md:w-64 md:shrink-0">
        <h1 className="mb-10 text-2xl font-extrabold tracking-tight text-violet-700">
          Recrut<span className="text-slate-800">RH</span>
        </h1>

        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Menu principal
        </p>

        <nav className="space-y-2">
          <a
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl bg-violet-600 px-4 py-3 font-medium text-white shadow-sm"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </a>

          <a
            href="/candidates"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
          >
            <Users size={19} />
            Candidats
          </a>

          <a
            href="/interviews"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
          >
            <CalendarDays size={19} />
            Entretiens
          </a>
        </nav>

        <div className="mt-8 border-t border-slate-100 pt-5 md:mt-auto">
          <a
            href="/settings"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 transition hover:bg-slate-50"
          >
            <Settings size={19} />
            Paramètres
          </a>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-8 lg:p-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Dashboard
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Bienvenue dans votre espace de recrutement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Rechercher"
              className="rounded-xl border border-slate-200 bg-white p-3 text-slate-500 transition hover:bg-slate-100"
            >
              <Search size={19} />
            </button>

            <button
              type="button"
              aria-label="Notifications"
              className="rounded-xl border border-slate-200 bg-white p-3 text-slate-500 transition hover:bg-slate-100"
            >
              <Bell size={19} />
            </button>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2 pr-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
                {user?.role === 'admin' ? 'AD' : 'RH'}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {user?.name || (user?.role === 'admin' ? 'Administrateur' : 'Responsable RH')}
                </p>
                <p className="text-xs text-slate-500">
                  {user?.role === 'admin' ? 'Administrateur' : 'Espace RH'}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-700 to-indigo-600 p-6 text-white shadow-lg shadow-violet-100 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="mb-2 text-sm font-medium text-violet-100">
                VOTRE ESPACE RH
              </p>
              <h3 className="text-2xl font-bold md:text-3xl">
                Bonjour, bienvenue !
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-violet-100">
                Gérez vos candidats et organisez vos entretiens depuis un seul espace.
              </p>
            </div>

            <div className="hidden rounded-2xl bg-white/15 p-5 sm:block">
              <BriefcaseBusiness size={42} />
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900">Vue d'ensemble</h3>
            <p className="mt-1 text-sm text-slate-500">
              Résumé de votre activité de recrutement
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon

              return (
                <article
                  key={stat.title}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className={`rounded-xl p-3 ${stat.color}`}>
                      <Icon size={22} />
                    </div>
                    <ArrowUpRight size={18} className="text-slate-300" />
                  </div>

                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="mt-2 text-xs text-slate-400">{stat.detail}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="font-bold text-slate-900">Entretiens récents</h3>
              <p className="mt-1 text-sm text-slate-500">
                Suivez les prochains rendez-vous
              </p>
            </div>

            <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center">
              <CalendarDays size={30} className="mb-3 text-slate-300" />
              <p className="font-medium text-slate-600">Aucun entretien pour le moment</p>
              <p className="mt-1 text-sm text-slate-400">
                Les entretiens apparaîtront ici.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="font-bold text-slate-900">Actions rapides</h3>
              <p className="mt-1 text-sm text-slate-500">
                Accédez à vos fonctionnalités
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="/candidates"
                className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-violet-200 hover:bg-violet-50"
              >
                <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
                  <Users size={21} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">Gérer les candidats</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Consulter les profils candidats
                  </p>
                </div>
                <ArrowUpRight size={18} className="text-slate-400" />
              </a>

              <a
                href="/interviews"
                className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-violet-200 hover:bg-violet-50"
              >
                <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                  <CalendarDays size={21} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">Gérer les entretiens</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Organiser les rendez-vous
                  </p>
                </div>
                <ArrowUpRight size={18} className="text-slate-400" />
              </a>
            </div>
          </div>
        </section>
      </main>
      </div>
    </>
  )
}

export default Dashboard
