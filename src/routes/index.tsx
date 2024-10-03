import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import {
  Dashboard,
  EntitiesDetail,
  EntitiesList,
  TransactionsList,
  TransactionsDetail
} from '../pages';

export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        icon: 'home',
        path: '/home-inicial',
        label: 'Página inicial',
      },
      {
        icon: 'people',
        path: '/entidades-prospects',
        label: 'Entidades Prospects',
      },
      {
        icon: 'build',
        path: '/ocorrencias-externas',
        label: 'Ocorrências Externas',
      }
    ]);
  }, []);

  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Dashboard />} />

      <Route path="/ocorrencias-externas" element={< TransactionsList />} />
      <Route path="/ocorrencias-externas/detalhe/:id" element={<TransactionsDetail />} />

      <Route path="/entidades-prospects" element={<EntitiesList />} />
      <Route path="/entidades-prospects/detalhe/:id" element={<EntitiesDetail />} />

      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes>
  );
};
