import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import {
  Dashboard,
  EntitiesDetail,
  EntitiesList,
  TransactionsList,
  TransactionsDetail,
  WorkOrdersList,
  WorkOrdersDetail
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
        label: 'Entidades Prospects',
      },
      {
        icon: 'assignment',
        path: '/ocorrencias-externas',
        label: 'Ocorrências Externas',
      },
      {
        icon: 'build',
        path: '/ordens-de-servico',
        label: 'Ordens de Serviço',
      },
    ]);
  }, []);

  return (
    <Routes>
      <Route path='/pagina-inicial' element={<Dashboard />} />

      <Route path='/ocorrencias-externas' element={<TransactionsList />} />
      <Route
        path='/ocorrencias-externas/detalhe/:id'
        element={<TransactionsDetail />}
      />

      <Route path='/entidades' element={<EntitiesList />} />
      <Route path='/entidades/detalhe/:id' element={<EntitiesDetail />} />

      <Route path='/ordens-de-servico' element={<WorkOrdersList />} />
      <Route path='/entidades/detalhe/:id' element={<WorkOrdersDetail />} />

      <Route path='*' element={<Navigate to='/pagina-inicial' />} />
    </Routes>
  );
};
