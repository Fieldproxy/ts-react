import {Dispatch} from "redux";

import {
  COMP_DATA_LOADING,
  COMP_DATA_SUCCESS,
  COMP_DATA_FAIL,
  compDataI,
  COMP_DETAIL_FAIL,
  COMP_DETAIL_LOADING,
  COMP_DETAIL_SUCCESS,
  OrganizationDispatchTypes,
  WorkflowAndTaskListDispatchTypes,
  WORKFLOW_TASK_LIST_SUCCESS,
  WORKFLOW_TASK_LIST_LOADING,
  WORKFLOW_TASK_LIST_FAIL,
} from "./organizationTypes";

import {ENQUEUE_SNACKBAR, notiStackTypes} from "../notistack/notiStackTypes";
import {ApiUrl} from "../../../config/apiUrl";
import axios from "axios";

type dispatchTypesI = notiStackTypes | any;

const getTotalAgents = (data: compDataI[]): number => {
  let totalOrganizations = 0;
  if (data && data.length) {
    totalOrganizations = data.reduce((a, b) => {
      return a + (b ? b.agents : 0);
    }, 0);
  }
  return totalOrganizations;
};

const formatOrgData = (data: compDataI[]): compDataI[] => {
  data.forEach(d => {
    if (d.createdAt) {
      d.createdAt = new Date(d.createdAt).toLocaleDateString();
    }
  });

  return data;
};

export const GetOrganizationList = () => async (dispatch: Dispatch<dispatchTypesI>) => {
  try {
    dispatch({type: COMP_DATA_LOADING});
    const res = await axios.get(ApiUrl.getOrganizations);
    if (res.status === 200) {
      if (res.data) {
        const {data, status} = res.data;
        if (status) {
          dispatch({
            type: COMP_DATA_SUCCESS,
            payload: {
              compData: formatOrgData(data.organizations),
              totalOrganizations: data.organizations.length,
              totalAgents: getTotalAgents(data.organizations),
            },
          });
        } else {
          throw new Error(data.error || "Unable to get data");
        }
      } else {
        throw new Error("cannot get data");
      }
    } else {
      throw new Error(`Api Failed with status ${res.status}`);
    }
  } catch (err) {
    dispatch({
      type: ENQUEUE_SNACKBAR,
      notification: {
        message: err.message,
        key: "getOrgList",
        options: {
          key: "getOrgList",
          variant: "error",
        },
      },
      key: "getOrgList",
    });
    dispatch({
      type: COMP_DATA_FAIL,
      payload: {message: err.message},
    });
  }
};

export const GetOrganizationDetail =
  (orgId: string) => async (dispatch: Dispatch<OrganizationDispatchTypes>) => {
    try {
      dispatch({type: COMP_DETAIL_LOADING});
      const res = await axios.get(`${ApiUrl.organizationDetail}/${orgId}`);
      if (res.status === 200) {
        const {data} = res;
        if (data.status) {
          dispatch({
            type: COMP_DETAIL_SUCCESS,
            payload: {
              data: data.data.companyDetails,
            },
          });
        } else {
          throw new Error(data.error || "Unable to get data");
        }
      } else {
        throw new Error(`Api Failed with status ${res.status}`);
      }
    } catch (err) {
      dispatch({
        type: COMP_DETAIL_FAIL,
        payload: {message: err.message},
      });
    }
  };

export const EditOrganizationDetail =
  (
    companyId: string,
    params: {
      notionLink: string;
      enableCatalogue: boolean;
      readyCatalogue: boolean;
      mobileNumberValidation: boolean;
    }
  ) =>
  async (dispatch: Dispatch<dispatchTypesI>) => {
    try {
      const res = await axios.post(`${ApiUrl.updateOrganization}`, {
        companyId,
        ...params,
      });
      if (res.status === 200) {
        const {data} = res;
        if (data.status) {
          dispatch({
            type: ENQUEUE_SNACKBAR,
            notification: {
              message: data.data.message,
              key: "editOrg",
              options: {
                key: "editOrg",
                variant: "success",
              },
            },
            key: "editOrg",
          });
          dispatch(GetOrganizationDetail(companyId));
        } else {
          throw new Error(data.error || "Unable to update data");
        }
      } else {
        throw new Error(`Api Failed with status ${res.status}`);
      }
    } catch (err) {
      dispatch({
        type: ENQUEUE_SNACKBAR,
        notification: {
          message: err.message,
          key: "editOrg",
          options: {
            key: "editOrg",
            variant: "error",
          },
        },
        key: "editOrg",
      });
    }
  };

export const GetWorkflowDetails =
  (orgId: string) =>
  async (dispatch: Dispatch<notiStackTypes | WorkflowAndTaskListDispatchTypes>) => {
    try {
      console.log(orgId);
      dispatch({type: WORKFLOW_TASK_LIST_LOADING});
      const res = await axios.get(`${ApiUrl.getWorkflowAndTaskList}/${orgId}`);
      if (res.status === 200) {
        const {data} = res;
        if (data.status) {
          console.log({data});
          dispatch({
            type: WORKFLOW_TASK_LIST_SUCCESS,
            payload: {
              tasks: data.data.tasks,
              workflows: data.data.workflows,
            },
          });
        } else {
          throw new Error(data.error || "Unable to get data");
        }
      } else {
        throw new Error(`Api Failed with status ${res.status}`);
      }
    } catch (err) {
      dispatch({
        type: WORKFLOW_TASK_LIST_FAIL,
        error: {message: err.message},
      });
      dispatch({
        type: ENQUEUE_SNACKBAR,
        notification: {
          message: err.message,
          key: "getWorkflowAndTaskList",
          options: {
            key: "getWorkflowAndTaskList",
            variant: "error",
          },
        },
        key: "getWorkflowAndTaskList",
      });
    }
  };
