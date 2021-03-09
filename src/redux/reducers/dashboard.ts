import {
  COMP_DATA_FAIL,
  COMP_DATA_LOADING,
  COMP_DATA_SUCCESS,
  compDataI,
  DashboardDispatchTypes,
} from "../actions/dashboard/dashboardTypes";

import { ErrorI } from "../actions/common";

export interface ActionI {
  type: String;
  payload: ErrorI | Array<compDataI>;
}

export interface dashboardI {
  loadingCompData: Boolean;
  compData?: Array<compDataI>;
  error?: ErrorI;
  totalAgents: number;
  totalOrganizations: number;
}

const initialState: dashboardI = {
  loadingCompData: false,
  compData: [],
  totalAgents: 0,
  totalOrganizations: 0,
  error: undefined,
};

const dashboardReducer = (
  state: dashboardI = initialState,
  action: DashboardDispatchTypes
): dashboardI => {
  switch (action.type) {
    case COMP_DATA_LOADING:
      return { ...state, loadingCompData: true, error: undefined };
    case COMP_DATA_SUCCESS:
      return {
        ...state,
        loadingCompData: false,
        compData: action.payload.compData,
        totalAgents: action.payload.totalAgents,
        totalOrganizations: action.payload.totalOrganizations,
        error: undefined,
      };
    case COMP_DATA_FAIL:
      return { ...initialState, loadingCompData: false, error: action.payload };
    default:
      return state;
  }
};

export default dashboardReducer;