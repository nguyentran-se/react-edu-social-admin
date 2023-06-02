import { Suspense, lazy } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import SuspenseLoader from 'src/components/SuspenseLoader';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Pages
// Dashboards

const Crypto = Loader(lazy(() => import('src/content/dashboards/Crypto')));

// Applications

const Messenger = Loader(lazy(() => import('src/content/applications/Messenger')));
const Transactions = Loader(lazy(() => import('src/content/applications/Transactions')));
const UserProfile = Loader(lazy(() => import('src/content/applications/Users/profile')));
const UserSettings = Loader(lazy(() => import('src/content/applications/Users/settings')));

// Components

const Buttons = Loader(lazy(() => import('src/content/pages/Components/Buttons')));
const Modals = Loader(lazy(() => import('src/content/pages/Components/Modals')));
const Accordions = Loader(lazy(() => import('src/content/pages/Components/Accordions')));
const Tabs = Loader(lazy(() => import('src/content/pages/Components/Tabs')));
const Badges = Loader(lazy(() => import('src/content/pages/Components/Badges')));
const Tooltips = Loader(lazy(() => import('src/content/pages/Components/Tooltips')));
const Avatars = Loader(lazy(() => import('src/content/pages/Components/Avatars')));
const Cards = Loader(lazy(() => import('src/content/pages/Components/Cards')));
const Forms = Loader(lazy(() => import('src/content/pages/Components/Forms')));

// Status

const Status404 = Loader(lazy(() => import('src/content/pages/Status/Status404')));
const Status500 = Loader(lazy(() => import('src/content/pages/Status/Status500')));
const StatusComingSoon = Loader(lazy(() => import('src/content/pages/Status/ComingSoon')));
const StatusMaintenance = Loader(lazy(() => import('src/content/pages/Status/Maintenance')));

// FUniverse
const GroupPage = Loader(lazy(() => import('src/pages/Group')));
const GroupUsersPage = Loader(lazy(() => import('src/pages/Group/GroupUsers')));
const GroupDetailPage = Loader(lazy(() => import('src/pages/Group/GroupDetail')));

const UserPage = Loader(lazy(() => import('src/pages/User')));
const UserDetailPage = Loader(lazy(() => import('src/pages/User/UserDetail')));

const CurriculumPage = Loader(lazy(() => import('src/pages/Curriculum')));
const CurriculumFormPage = Loader(lazy(() => import('src/pages/Curriculum/CurriculumForm')));
const CurriculumDetailPage = Loader(lazy(() => import('src/pages/Curriculum/CurriculumDetail')));
const CurriculumComboDetailPage = Loader(
  lazy(() => import('src/pages/Curriculum/CurriculumDetail/CurriculumComboDetail')),
);
const CurriculumUsersPage = Loader(lazy(() => import('src/pages/Curriculum/CurriculumUsers')));
const SyllabusPage = Loader(lazy(() => import('src/pages/Syllabus')));
const SyllabusFormPage = Loader(lazy(() => import('src/pages/Syllabus/SyllabusForm')));
const TermPreparePage = Loader(lazy(() => import('src/pages/TermPrepare')));
const OnboardPage = Loader(lazy(() => import('src/pages/Onboard')));
const SyllabusDetailPage = Loader(lazy(() => import('src/pages/Syllabus/SyllabusDetail')));
const SubjectPage = Loader(lazy(() => import('src/pages/Subject')));
const SubjectDetailPage = Loader(lazy(() => import('src/pages/Subject/SubjectDetail')));
const ComboPage = Loader(lazy(() => import('src/pages/Combo')));
const ComboDetailPage = Loader(lazy(() => import('src/pages/Combo/ComboDetail')));
const SeasonPage = Loader(lazy(() => import('src/pages/Season')));
const SeasonDetailPage = Loader(lazy(() => import('src/pages/Season/SeasonDetail')));
const MajorPage = Loader(lazy(() => import('src/pages/Major')));
const MajorDetailPage = Loader(lazy(() => import('src/pages/Major/MajorDetail')));
const ImportDataPage = Loader(lazy(() => import('src/pages/ImportData')));
const WorkspacePage = Loader(lazy(() => import('src/pages/Workspace')));
// const SpecializationPage = Loader(lazy(() => import('src/pages/Specialization')));
const routes: RouteObject[] = [
  {
    path: '',
    element: <SidebarLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/groups" replace />,
      },
      // {
      //   path: 'overview',
      //   element: <Navigate to="/" replace />,
      // },
      {
        path: 'status',
        children: [
          {
            path: '',
            element: <Navigate to="404" replace />,
          },
          {
            path: '404',
            element: <Status404 />,
          },
          {
            path: '500',
            element: <Status500 />,
          },
          {
            path: 'maintenance',
            element: <StatusMaintenance />,
          },
          {
            path: 'coming-soon',
            element: <StatusComingSoon />,
          },
        ],
      },
      {
        path: '*',
        element: <Status404 />,
      },
    ],
  },
  {
    path: 'workspace',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <WorkspacePage />,
      },
    ],
  },
  {
    path: 'term',
    // element: <SidebarLayout />,
    children: [
      {
        path: 'prepare',
        element: <TermPreparePage />,
      },
      // {
      //   path: ':slug',
      //   element: <GroupDetailPage />,
      // },
    ],
  },
  {
    path: 'onboard',
    // element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <OnboardPage />,
      },
      // {
      //   path: ':slug',
      //   element: <GroupDetailPage />,
      // },
    ],
  },
  {
    path: 'seasons',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <SeasonPage />,
      },
      {
        path: ':slug',
        element: <SeasonDetailPage />,
      },
    ],
  },
  {
    path: 'groups',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <GroupPage />,
      },
      {
        path: ':slug',
        element: <GroupDetailPage />,
      },
      {
        path: ':slug/users',
        element: <GroupUsersPage />,
      },
    ],
  },
  {
    path: 'users',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <UserPage />,
      },
      {
        path: ':slug',
        element: <UserDetailPage />,
      },
    ],
  },
  {
    path: 'subjects',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <SubjectPage />,
      },
      {
        path: ':slug',
        element: <SubjectDetailPage />,
      },
    ],
  },
  {
    path: 'majors',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <MajorPage />,
      },
      {
        path: ':slug',
        element: <MajorDetailPage />,
      },
    ],
  },
  // {
  //   path: 'specializations',
  //   element: <SidebarLayout />,
  //   children: [
  //     {
  //       path: '',
  //       element: <SpecializationPage />,
  //     },
  //   ],
  // },
  {
    path: 'syllabi',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <SyllabusPage />,
      },
      {
        path: ':slug',
        element: <SyllabusDetailPage />,
      },
      // {
      //   path: 'create',
      //   element: <SyllabusFormPage />,
      // },
      // {
      //   path: ':slug/edit',
      //   element: <SyllabusFormPage />,
      // },
    ],
  },
  {
    path: 'curricula',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <CurriculumPage />,
      },
      {
        path: ':slug',
        element: <CurriculumDetailPage />,
      },
      {
        path: ':slug/combo/:comboSlug',
        element: <CurriculumComboDetailPage />,
      },
      {
        path: ':slug/users',
        element: <CurriculumUsersPage />,
      },
      // {
      //   path: 'create',
      //   element: <CurriculumFormPage />,
      // },
      // {
      //   path: ':slug/edit',
      //   element: <CurriculumFormPage />,
      // },
    ],
  },
  {
    path: 'combos',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <ComboPage />,
      },
      {
        path: ':slug',
        element: <ComboDetailPage />,
      },
    ],
  },
  {
    path: 'import',
    element: <SidebarLayout />,
    children: [
      {
        path: 'data',
        element: <ImportDataPage />,
      },
    ],
  },
  {
    path: 'dashboards',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="crypto" replace />,
      },
      {
        path: 'crypto',
        element: <Crypto />,
      },
      {
        path: 'messenger',
        element: <Messenger />,
      },
    ],
  },
  {
    path: 'management',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="transactions" replace />,
      },
      {
        path: 'transactions',
        element: <Transactions />,
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            element: <Navigate to="details" replace />,
          },
          {
            path: 'details',
            element: <UserProfile />,
          },
          {
            path: 'settings',
            element: <UserSettings />,
          },
        ],
      },
    ],
  },
  {
    path: '/components',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="buttons" replace />,
      },
      {
        path: 'buttons',
        element: <Buttons />,
      },
      {
        path: 'modals',
        element: <Modals />,
      },
      {
        path: 'accordions',
        element: <Accordions />,
      },
      {
        path: 'tabs',
        element: <Tabs />,
      },
      {
        path: 'badges',
        element: <Badges />,
      },
      {
        path: 'tooltips',
        element: <Tooltips />,
      },
      {
        path: 'avatars',
        element: <Avatars />,
      },
      {
        path: 'cards',
        element: <Cards />,
      },
      {
        path: 'forms',
        element: <Forms />,
      },
    ],
  },
];

export default routes;
export const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs(routes);

  return (
    <MuiBreadcrumbs>
      {breadcrumbs.map(({ match, breadcrumb }) => (
        <MuiLink component={NavLink} key={match.pathname} to={match.pathname}>
          {breadcrumb}
        </MuiLink>
      ))}
    </MuiBreadcrumbs>
  );
};
