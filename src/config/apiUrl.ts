export const base = "https://port3002.fieldproxy.com";
export const host = `${base}/v2/adminpanel`;

export const ApiUrl = {
  // auth
  signIn: `${host}/signin`,
  signOut: `${host}/signout`,
  companyData: `${base}/compData`,
  getOrganizations:`${host}/getOrganizations`,
  organizationDetail: `${host}/getOrganization`,
  updateOrganization: `${host}/updateOrganization`,
  deviceDetails: `${host}/deviceDetails`
};
  