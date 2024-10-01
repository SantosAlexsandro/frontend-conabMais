import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import {
  Dashboard,
  ItemsDetail,
  ItemsList,
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
        path: '/entidades',
        label: 'Entidades',
      },
      {
        icon: 'build',
        path: '/pre-orcamentos',
        label: 'Ocorrências',
      }
    ]);
  }, []);

  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Dashboard />} />

      <Route path="/pre-orcamentos" element={< TransactionsList />} />
      <Route path="/pre-orcamentos/detalhe/:id" element={<TransactionsDetail />} />

      <Route path="/items" element={<ItemsList />} />
      <Route path="/items/detail/:id" element={<ItemsDetail />} />

      <Route path="/entidades" element={<EntitiesList />} />
      <Route path="/entidades/detalhe/:id" element={<EntitiesDetail />} />

      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes>
  );
};
