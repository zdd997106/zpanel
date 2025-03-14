import { DataType, UpdatePortfolioDto } from '@zpanel/core';

import Service, { takeData } from 'src/service/service';

// ----- CONTEXT -----

const ENDPOINT = `/projects/portfolio`;
const api = new Service();

// ----- GET: ALL PORTFOLIO -----

export const getPortfolioDetail = () =>
  takeData<DataType.PortfolioDto | null>(api.get(getPortfolioDetail.getPath()));
getPortfolioDetail.getPath = () => `${ENDPOINT}`;

// ----- PUT: UPDATE PORTFOLIO ------

export const updatePortfolio = (payload: UpdatePortfolioDto) =>
  takeData<void>(api.put(updatePortfolio.getPath(), payload));
updatePortfolio.getPath = () => `${ENDPOINT}`;
