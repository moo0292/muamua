angular.module('starter.controllers', [])

.controller('HomeCtrl', function($ionicPopup, $ionicPlatform, $http, $rootScope, $scope, $location, $cordovaGeolocation, $cordovaDevice, $ionicLoading) {

        $scope.allMessages = [];
        $scope.checked = true;
        $scope.currentState = "New";
        $scope.currentFrNumber = 0;

        $scope.goToSpecific = function(frontNum) {
            console.log($scope.allMessages);
            console.log($scope.allMessages[frontNum]);
            console.log(frontNum);
            $location.path('/tab/home/detail');
            $rootScope.selectedNumber = frontNum;
            $rootScope.selectedMessage = $scope.allMessages[frontNum]
        };

        $scope.voteUp = function(arrayIndex, messageId) {
            $scope.allMessages[arrayIndex].canUpVote = false;
            $scope.allMessages[arrayIndex].canDownVote = false;
            $scope.allMessages[arrayIndex].rating++;

            $http.put("http://10.0.1.181:7000/upvote/" + $rootScope.uuid + "/" + messageId)
                .success(function(data) {

                }, function(err) {
                    alert("Unable to upvote message");
                });
        };
        $scope.voteDown = function(arrayIndex, messageId) {
            $scope.allMessages[arrayIndex].canUpVote = false;
            $scope.allMessages[arrayIndex].canDownVote = false;
            $scope.allMessages[arrayIndex].rating--;

            $http.put("http://10.0.1.181:7000/downvote/" + $rootScope.uuid + "/" + messageId)
                .success(function(data) {

                }, function(err) {

                    alert("Unable to downote message");
                });
        };

        $scope.voteUpSpec = function(arrayIndex, messageId) {
            $scope.allMessages[arrayIndex].canUpVote = false;
            $scope.allMessages[arrayIndex].canDownVote = false;
            $scope.allMessages[arrayIndex].rating++;

            $rootScope.selectedMessage.canUpVote = false;
            $rootScope.selectedMessage.canDownVote = false;
            $rootScope.selectedMessage.rating++;

            $http.put("http://10.0.1.181:7000/upvote/" + $rootScope.uuid + "/" + messageId)
                .success(function(data) {

                }, function(err) {
                    alert("Unable to upvote message");
                });
        };

        $scope.voteDownSpec = function(arrayIndex, messageId) {
            $scope.allMessages[arrayIndex].canUpVote = false;
            $scope.allMessages[arrayIndex].canDownVote = false;
            $scope.allMessages[arrayIndex].rating--;

            $rootScope.selectedMessage.canUpVote = false;
            $rootScope.selectedMessage.canDownVote = false;
            $rootScope.selectedMessage.rating--;

            $http.put("http://10.0.1.181:7000/downvote/" + $rootScope.uuid + "/" + messageId)
                .success(function(data) {

                }, function(err) {

                    alert("Unable to downote message");
                });
        };

        $scope.doRefresh = function() {

            $ionicLoading.show({
                template: 'Loading...'
            });

            $http.get("http://10.0.1.181:7000/get_all/" + $rootScope.longt + "/" + $rootScope.lat)
                .success(function(data) {
                    $scope.allMessages = data;
                    for (var i = 0; i < $scope.allMessages.length; i++) {
                        //do an underscore contain to check if a user can still vote
                        $scope.allMessages[i].frontNumber = i;
                        // console.log($scope.allMessages[i].voters);
                        if (_.contains($scope.allMessages[i].voters, $rootScope.uuid)) {
                            $scope.allMessages[i].canUpVote = false;
                            $scope.allMessages[i].canDownVote = false;
                        } else {
                            $scope.allMessages[i].canUpVote = true;
                            $scope.allMessages[i].canDownVote = true;
                        }
                    }
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                })
        };

        $scope.shouldShow = function() {
            return false;
        };

        $scope.changeToNew = function() {

            $ionicLoading.show({
                template: 'Loading...'
            });

            $http.get("http://10.0.1.181:7000/get_all/" + $rootScope.longt + "/" + $rootScope.lat)
                .success(function(data) {
                    $scope.allMessages = data;
                    for (var i = 0; i < $scope.allMessages.length; i++) {
                        //do an underscore contain to check if a user can still vote
                        $scope.allMessages[i].frontNumber = i;
                        // console.log($scope.allMessages[i].voters);
                        if (_.contains($scope.allMessages[i].voters, $rootScope.uuid)) {
                            $scope.allMessages[i].canUpVote = false;
                            $scope.allMessages[i].canDownVote = false;
                        } else {
                            $scope.allMessages[i].canUpVote = true;
                            $scope.allMessages[i].canDownVote = true;
                        }
                    }
                    $ionicLoading.hide();
                    console.log($scope.allMessages);
                    $scope.$broadcast('scroll.refreshComplete');
                })
        };

        $scope.changeToHot = function() {


            $scope.allMessages.sort(function(a, b) {
                return b.rating - a.rating;
            });




            // $ionicLoading.show({
            //     template: 'Loading...'
            // });

            // $http.get("http://10.0.1.181:7000/highest_rated/" + $rootScope.longt + "/" + $rootScope.lat)
            //     .success(function(data) {

            //         $scope.allMessages = data;

            //         for (var i = 0; i < $scope.allMessages.length; i++) {
            //             //do an underscore contain to check if a user can still vote
            //             $scope.allMessages[i].frontNumber = i;
            //             // console.log($scope.allMessages[i].voters);
            //             if (_.contains($scope.allMessages[i].voters, $rootScope.uuid)) {
            //                 $scope.allMessages[i].canUpVote = false;
            //                 $scope.allMessages[i].canDownVote = false;
            //             } else {
            //                 $scope.allMessages[i].canUpVote = true;
            //                 $scope.allMessages[i].canDownVote = true;
            //             }
            //         }
            //         $ionicLoading.hide();
            //     })
        };

        $rootScope.deleteMessage = function(messageId) {
            console.log(messageId);

            $scope.sendObject = {};
            $scope.sendObject.message_id = messageId;

            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm',
                template: 'Do you want to report this message?'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    $ionicLoading.show({
                        template: 'Loading...'
                    });
                    $http.post("http://10.0.1.181:7000/report", $scope.sendObject)
                        .success(function(data) {
                            //you also have to do a post to add the comment onto a person's array
                            $ionicLoading.hide();
                            alert("Message has been reported");
                        }, function(err) {
                            $ionicLoading.hide();
                            alert("Unable to post message");
                        });
                } else {

                }
            });
        }

        $scope.reply_text = {};
        $scope.reply_object = {};

        $scope.submitReply = function() {

            $scope.reply_text.message_id = $rootScope.selectedMessage._id;
            $scope.reply_text.user_id = $rootScope.user_id;

            if ($scope.reply_text.answer.length == 0) {
                alert("Can't submit empty reply");
            } else {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirm',
                    template: 'Are you sure to post message?'
                });

                confirmPopup.then(function(res) {
                    if (res) {
                        $ionicLoading.show({
                            template: 'Loading...'
                        });
                        $http.post("http://10.0.1.181:7000/post_reply", $scope.reply_text)
                            .success(function(data) {
                                //you also have to do a post to add the comment onto a person's array
                                $ionicLoading.hide();
                                $rootScope.selectedMessage.comment.push($scope.reply_text.answer);
                                $scope.reply_text = {};
                            }, function(err) {
                                $ionicLoading.hide();
                                alert("Unable to post reply");
                            });
                    } else {

                    }
                });

            }
        };

        $ionicPlatform.ready(function() {

            $rootScope.uuid = $cordovaDevice.getUUID();

            var posOptions = {
                timeout: 10000,
                enableHighAccuracy: false
            };


            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function(position) {
                    $rootScope.lat = position.coords.latitude
                    $rootScope.longt = position.coords.longitude

                    $ionicLoading.show({
                        template: 'Loading...'
                    });

                    $http.get("http://10.0.1.181:7000/find_user/" + $rootScope.uuid)
                        .success(function(user) {
                            $rootScope.user_id = user._id;
                            $rootScope.user_posts = user.posts;
                        })

                    $http.get("http://10.0.1.181:7000/get_all/" + $rootScope.longt + "/" + $rootScope.lat)
                        .success(function(data) {
                            $scope.allMessages = data;
                            for (var i = 0; i < $scope.allMessages.length; i++) {
                                //do an underscore contain to check if a user can still vote
                                // console.log($scope.allMessages[i].voters);
                                if (_.contains($scope.allMessages[i].voters, $rootScope.uuid)) {
                                    $scope.allMessages[i].canUpVote = false;
                                    $scope.allMessages[i].canDownVote = false;
                                } else {
                                    $scope.allMessages[i].canUpVote = true;
                                    $scope.allMessages[i].canDownVote = true;
                                }
                            }

                            $ionicLoading.hide();
                        })
                        .error(function(data) {
                            alert("Unable to connect to the server. Check your internet connection");
                        });

                }, function(err) {
                    alert("Cannot get current user location");
                });

        });

    })
    .controller('PeekCtrl', function($ionicPopup, $ionicPlatform, $http, $rootScope, $scope, $location, $cordovaGeolocation, $cordovaDevice, $ionicLoading) {


        $scope.goToPeek = function() {
            $location.path('/tab/peek/detail');
        }
        $scope.goToPeekDetail = function(peekTitle, latitude, longitude) {

            $rootScope.peek_title = peekTitle;

            //pass in the latitude and longitude
            //get the highest rated of each university

            $ionicLoading.show({
                template: 'Loading...'
            });

            $http.get("http://10.0.1.181:7000/school_rated/" + longitude + "/" + latitude)
                .success(function(data) {

                    $rootScope.peekArray = [];
                    //set the peek array
                    $rootScope.peekArray = data;
                    $rootScope.peekArray.sort(function(a, b) {
                        return b.rating - a.rating;
                    });
                    //go to the peek page
                    $ionicLoading.hide();
                    $location.path('/tab/peek/detail');
                })
        };

        $scope.goPeekDetailMessage = function(input_index) {
            $rootScope.selectedPeekMessage = $rootScope.peekArray[input_index];
            $location.path('/tab/peek/detail/message');
        };

        $scope.reply_text = {};
        $scope.reply_object = {};

        $scope.submitReply = function() {

            $scope.reply_text.message_id = $rootScope.selectedPeekMessage._id;
            $scope.reply_text.submit_user = $rootScope.user_id



            if ($scope.reply_text.answer.length == 0) {
                alert("Can't submit empty reply");
            } else {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirm',
                    template: 'Are you sure to post message?'
                });

                confirmPopup.then(function(res) {
                    if (res) {
                        $ionicLoading.show({
                            template: 'Loading...'
                        });
                        $http.post("http://10.0.1.181:7000/post_reply", $scope.reply_text)
                            .success(function(data) {
                                //you also have to do a post to add the comment onto a person's array
                                $ionicLoading.hide();
                                $rootScope.selectedMessage.comment.push($scope.reply_text.answer);
                                $scope.reply_text = {};
                            }, function(err) {
                                $ionicLoading.hide();
                                alert("Unable to post message");
                            });
                    } else {

                    }
                });

            }

        };
    })
    .controller('ProfileCtrl', function($http, $scope, $location, $rootScope, $ionicPopup, $ionicLoading) {
        $scope.goToSpecific = function(frontNum) {
            $location.path('/tab/profile/detail');
            $rootScope.selectedNumber = frontNum;
            $rootScope.selectedMessage = $rootScope.user_posts[frontNum];
            console.log(frontNum);
            console.log($rootScope.selectedMessage);
        };

        $scope.reply_text = {};
        $scope.reply_object = {};

        $scope.submitReply = function() {

            $scope.reply_text.message_id = $rootScope.selectedMessage._id;

            console.log($scope.reply_text);
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm',
                template: 'Are you sure to post message?'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    $ionicLoading.show({
                        template: 'Loading...'
                    });
                    $http.post("http://10.0.1.181:7000/post_reply", $scope.reply_text)
                        .success(function(data) {
                            //you also have to do a post to add the comment onto a person's array
                            $ionicLoading.hide();
                            $rootScope.selectedMessage.comment.push($scope.reply_text.answer);
                            $scope.reply_text = {};
                        }, function(err) {
                            $ionicLoading.hide();
                            alert("Unable to post message");
                        })
                        .error(function(data) {
                            alert("Unable to connect to the server. Check your internet connection");
                        });
                } else {

                }
            });

        };

        $scope.refresh = function() {
            $http.get("http://10.0.1.181:7000/find_user/" + $rootScope.uuid)
                .success(function(user) {
                    $rootScope.user_posts = user.posts;
                })

            $scope.$broadcast('scroll.refreshComplete');

        };


    })
    .controller('WriteCtrl', function($ionicPopup, $http, $scope, $rootScope, $ionicLoading) {
        $scope.body_text = {
            title: "",
            body: ""
        };


        $scope.writeMessage = function() {

            $scope.object = {};
            $scope.object.title = $scope.body_text.title;
            $scope.object.latitude = $rootScope.lat;
            $scope.object.longtitude = $rootScope.longt;
            $scope.object.text = $scope.body_text.body;
            $scope.object.owner = $rootScope.user_id;

            if ($scope.body_text.title.length > 100 || $scope.body_text.body.length > 200) {
                alert("You are going over word limit");
            } else if ($scope.body_text.body.length == 0) {
                alert("Your body is empty");
            } else {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirm',
                    template: 'Are you sure to post message?'
                });


                confirmPopup.then(function(res) {
                    if (res) {
                        $ionicLoading.show({
                            template: 'Loading...'
                        });
                        $http.post("http://10.0.1.181:7000/post_message", $scope.object)
                            .success(function(data) {
                                //you also have to do a post to add the comment onto a person's array
                                $ionicLoading.hide();
                                $scope.body_text = {};
                                alert("successfully post message");
                            }, function(err) {
                                $ionicLoading.hide();
                                alert("Unable to post message");
                            });
                    } else {

                    }
                });
            }
        }
    });