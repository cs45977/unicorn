var Machine = require("machine");
module.exports = {
    'create': function(req, res) {
        Machine.build({
            inputs: {
                "email": {
                    "example": "abc123"
                }
            },
            exits: {
                respond: {}
            },
            fn: function(inputs, exits) {
                // Find One User
                sails.machines['_project_3202_0.0.15'].findOne_user({
                    "criteria": {
                        email: inputs.email
                    }
                }).setEnvironment({
                    sails: sails
                }).exec({
                    "success": function(findOneUser) {
                        // Unique(ish)
                        sails.machines['03558d7e-53ad-4e20-b03f-ddd54c34ce3c_4.2.0'].unique({}).exec({
                            "error": function(uniqueIsh) {
                                return exits.error({
                                    data: uniqueIsh,
                                    status: 500
                                });

                            },
                            "success": function(uniqueIsh) {
                                // Update User
                                sails.machines['_project_3202_0.0.15'].update_user({
                                    "authToken": uniqueIsh,
                                    "criteria": {
                                        id: (findOneUser && findOneUser.id)
                                    }
                                }).setEnvironment({
                                    sails: sails
                                }).exec({
                                    "success": function(updateUser) {
                                        // Send html email
                                        sails.machines['00ba429e-d255-4f44-8efc-af6f5cfa4942_0.3.1'].sendHtmlEmail({
                                            "apiKey": "key-c691477da603d1ffe038e78320cf44bb",
                                            "domain": "sandbox195a511ff2ee409ebc79f6c376c401c3.mailgun.org",
                                            "toEmail": (findOneUser && findOneUser.email),
                                            "toName": (findOneUser && findOneUser.username),
                                            "subject": "Unicorn Password Recovery",
                                            "htmlMessage": "<h2 style=\"color:pink;\">Did you forget your password?</h2> <p style=\"color:purple;font-weight:bold;font-size:16px;\">If so, you can reset it at http://localhost:1337/#/reset/" + uniqueIsh + "</p><h2 style=\"color:purple;\"><em>Hooray!</em></h2><img src=\"http://i.imgur.com/LHbMISf.gif?1\">",
                                            "fromEmail": "donotreply@unicorn.io",
                                            "fromName": "Unicorn Recovery Service"
                                        }).exec({
                                            "error": function(sendHtmlEmail) {
                                                return exits.error({
                                                    data: sendHtmlEmail,
                                                    status: 500
                                                });

                                            },
                                            "success": function(sendHtmlEmail) {
                                                return exits.respond({
                                                    action: "respond_with_status",
                                                    status: 200
                                                });

                                            }
                                        });

                                    },
                                    "error": function(updateUser) {
                                        return exits.error({
                                            data: updateUser,
                                            status: 500
                                        });

                                    }
                                });

                            }
                        });

                    },
                    "error": function(findOneUser) {
                        return exits.error({
                            data: findOneUser,
                            status: 500
                        });

                    },
                    "notFound": function(findOneUser) {
                        return exits.error({
                            data: findOneUser,
                            status: 500
                        });

                    }
                });
            }
        }).configure(req.params.all(), {
            respond: res.response,
            error: res.negotiate
        }).exec();
    }
};