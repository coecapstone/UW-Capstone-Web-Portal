# File Structure

`Admin/` : All specific `.js` files related to **Administrator** access level.

`approvers/` : All specific `.js` files related to **Approver** access level.

`buyers/` : All specific `.js` files related to **Fiscal Staff** access level.

`connections/` : Define some functions that enable front-end pages use back-end API. Also some functions that used commonly for each access level.

`Croppie/` : Some files added by previous co-workers. Basically for style control of user-settings page.

`login/` : `.js` files for **Login** pages.

`requests/` : Communal modules for **requests**.

`users/` : All specific `.js` files related to **Submitter** access level.



**Notice:** all `*-request-detail.js` file under corresponding access level are deprecated. Currently we just need to include the three modules under `requests/` folder to control request detail page in all access levels.