describe("User API Tests", () => {
  let authToken;
  let userId;
  const createUser = () => {
    const user = {
      nom: "admin",
      prenom: "Doe",
      email: "admin.doe@example.com",
      password: "azazaz",
      confirm_password: "azazaz",
      date_inscription: "2023-11-13 00:05:30",
      role: "Admin",
    };

    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/v1/users",
      body: user,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(201);
    });
  };

  const loginUser = () => {
    const credentials = {
      email: "admin.doe@example.com",
      password: "azazaz",
    };

    cy.request("POST", "http://localhost:3000/api/v1/users/login", credentials)
      .its("body")
      .then((body) => {
        authToken = body.token;
        userId = body.id;
        cy.wrap(authToken).as("adminAuthToken");
      });
  };

  it("should get all users", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:3000/api/v1/users",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(200);

      expect(response.body).to.be.an("array");
    });
  });

  it("should handle validation error when creating a user", () => {
    const user = {
      nom: "admin",
      prenom: "Doe",
      email: "admin.doe@example.com",
      password: "password123",
      confirm_password: "password123",
      date_inscription: "2023-11-13 00:05:30",
      role: "Admin",
    };

    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/v1/users",
      body: user,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(400);

      expect(response.headers["content-type"]).to.include("application/json");

      expect(response.body).to.have.property("type", "error");
      expect(response.body).to.have.property("status", 400);
      expect(response.body).to.have.property("message", "Validation faild");
      expect(response.body.errors).to.be.an("array");
      expect(response.body.errors).to.have.lengthOf(1);
      expect(response.body.errors[0]).to.deep.equal({
        value: "password123",
        msg: "Password can contain max 10 characters",
        param: "password",
        location: "body",
      });
    });
  });

  it("should handle registration with missing fields", () => {
    const incompleteUserData = {
      nom: "admin",
      prenom: "Doe",
    };

    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/v1/users",
      body: incompleteUserData,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal("Validation faild");
      expect(response.body.errors).to.deep.equal([
        {
          msg: "Email is required",
          param: "email",
          location: "body",
        },
        {
          msg: "Must be a valid email",
          param: "email",
          location: "body",
        },
        {
          msg: "Password is required",
          param: "password",
          location: "body",
        },
        {
          msg: "Invalid value",
          param: "password",
          location: "body",
        },
        {
          msg: "Password must contain at least 6 characters",
          param: "password",
          location: "body",
        },
        {
          msg: "Invalid value",
          param: "confirm_password",
          location: "body",
        },
      ]);
    });
  });

  it("should create a new user", () => {
    createUser();
  });

  it("should log in with correct credentials", () => {
    const validCredentials = {
      email: "wajdigridha744@gmail.com",
      password: "azazaz",
    };

    cy.request(
      "POST",
      "http://localhost:3000/api/v1/users/login",
      validCredentials
    )
      .its("status")
      .should("equal", 200);
  });

  it("should handle login failure with incorrect credentials", () => {
    const invalidCredentials = {
      email: "incorrect@example.com",
      password: "testazaz",
    };

    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/v1/users/login",
      body: invalidCredentials,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal("Unable to login!");
    });
  });

  const updatedUserData = {
    nom: "UpdatedName",
    prenom: "UpdatedLastName",
    email: "admin.doe@example.com",
    password: "azazaz",
    confirm_password: "azazaz",
    date_inscription: "2023-11-13 00:05:30",
    role: "Admin",
  };

  it("should update a user", () => {
    loginUser();

    cy.wrap().then(() => {
      cy.get("@adminAuthToken").then((authToken) => {
        cy.request({
          method: "PATCH",
          url: `http://localhost:3000/api/v1/users/id/${userId}`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: updatedUserData,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(200);
        });
      });
    });
  });

  it("should delete a user", () => {
    loginUser();

    cy.wrap().then(() => {
      cy.get("@adminAuthToken").then((authToken) => {
        cy.request({
          method: "DELETE",
          url: `http://localhost:3000/api/v1/users/id/${userId}`,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(200);
        });
      });
    });
  });
});
