angular.module('starter.controllers', [])

.controller('HomeCtrl', function($ionicModal, $ionicPopup, $ionicPlatform, $http, $rootScope, $scope, $location, $cordovaGeolocation, $cordovaDevice, $ionicLoading) {
        console.log("Home ctrl");
        $rootScope.allMessages = [];
        $scope.checked = true;
        $scope.currentState = "New";
        $scope.currentFrNumber = 0;
        $scope.customMessage = "loading";


        $ionicModal.fromTemplateUrl('templates/modal.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.closeModal = function() {
            $scope.modal.hide();
        }

        $scope.goToSpecific = function(frontNum) {

            $rootScope.selectedNumber = frontNum;
            $rootScope.selectedMessage = $rootScope.allMessages[frontNum]
            $location.path('/tab/home/detail');
        };

        $scope.voteUp = function(arrayIndex, messageId) {
            $rootScope.allMessages[arrayIndex].canUpVote = false;
            $rootScope.allMessages[arrayIndex].canDownVote = false;
            $rootScope.allMessages[arrayIndex].rating++;

            $http.put("https://ancient-brook-8956.herokuapp.com/upvote/" + $rootScope.uuid + "/" + messageId)
                .success(function(data) {

                }, function(err) {
                    alert("ไม่สามารถ upvote ข้อความ");
                });
        };
        $scope.voteDown = function(arrayIndex, messageId) {
            $rootScope.allMessages[arrayIndex].canUpVote = false;
            $rootScope.allMessages[arrayIndex].canDownVote = false;
            $rootScope.allMessages[arrayIndex].rating--;

            $http.put("https://ancient-brook-8956.herokuapp.com/downvote/" + $rootScope.uuid + "/" + messageId)
                .success(function(data) {

                }, function(err) {

                    alert("ไม่สามารถ downvote ข้อความ");
                });
        };

        $scope.doRefresh = function() {

            var posOptions = {
                timeout: 10000,
                enableHighAccuracy: false
            };

            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function(position) {
                    $rootScope.lat = position.coords.latitude
                    $rootScope.longt = position.coords.longitude

                    $http.get("https://ancient-brook-8956.herokuapp.com/get_all/" + $rootScope.longt + "/" + $rootScope.lat)
                        .success(function(data) {
                            $rootScope.allMessages = data;
                            for (var i = 0; i < $rootScope.allMessages.length; i++) {
                                //do an underscore contain to check if a user can still vote
                                // console.log($rootScope.allMessages[i].voters);
                                if (_.contains($rootScope.allMessages[i].voters, $rootScope.uuid)) {
                                    $rootScope.allMessages[i].canUpVote = false;
                                    $rootScope.allMessages[i].canDownVote = false;
                                } else {
                                    $rootScope.allMessages[i].canUpVote = true;
                                    $rootScope.allMessages[i].canDownVote = true;
                                }
                            }


                            $scope.$broadcast('scroll.refreshComplete');
                        })
                        .error(function(data) {
                            alert("ไม่สามารถต่อ server ได้ในขณะนี้");
                        });

                }, function(err) {
                    alert("ไม่สามารถหาที่อยู่ของคุณได้");
                });

        };

        $scope.shouldShow = function() {
            return false;
        };

        $scope.changeToNew = function() {

            $ionicLoading.show({
                template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
            });

            $http.get("https://ancient-brook-8956.herokuapp.com/get_all/" + $rootScope.longt + "/" + $rootScope.lat)
                .success(function(data) {
                    $rootScope.allMessages = data;
                    for (var i = 0; i < $rootScope.allMessages.length; i++) {
                        //do an underscore contain to check if a user can still vote
                        $rootScope.allMessages[i].frontNumber = i;
                        // console.log($rootScope.allMessages[i].voters);
                        if (_.contains($rootScope.allMessages[i].voters, $rootScope.uuid)) {
                            $rootScope.allMessages[i].canUpVote = false;
                            $rootScope.allMessages[i].canDownVote = false;
                        } else {
                            $rootScope.allMessages[i].canUpVote = true;
                            $rootScope.allMessages[i].canDownVote = true;
                        }
                    }
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                })
        };

        $scope.changeToHot = function() {


            $rootScope.allMessages.sort(function(a, b) {
                return b.rating - a.rating;
            });


            // $ionicLoading.show({
            //     template: 'Loading...'
            // });

            // $http.get("https://ancient-brook-8956.herokuapp.com/highest_rated/" + $rootScope.longt + "/" + $rootScope.lat)
            //     .success(function(data) {

            //         $rootScope.allMessages = data;

            //         for (var i = 0; i < $rootScope.allMessages.length; i++) {
            //             //do an underscore contain to check if a user can still vote
            //             $rootScope.allMessages[i].frontNumber = i;
            //             // console.log($rootScope.allMessages[i].voters);
            //             if (_.contains($rootScope.allMessages[i].voters, $rootScope.uuid)) {
            //                 $rootScope.allMessages[i].canUpVote = false;
            //                 $rootScope.allMessages[i].canDownVote = false;
            //             } else {
            //                 $rootScope.allMessages[i].canUpVote = true;
            //                 $rootScope.allMessages[i].canDownVote = true;
            //             }
            //         }
            //         $ionicLoading.hide();
            //     })
        };

        $rootScope.deleteMessage = function(messageId) {

            $scope.sendObject = {};
            $scope.sendObject.message_id = messageId;

            var confirmPopup = $ionicPopup.confirm({
                title: 'คอนเฟิร์ม',
                template: 'เเจ้งความข้อความนี้?'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    $ionicLoading.show({
                        template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
                    });
                    $http.post("https://ancient-brook-8956.herokuapp.com/report", $scope.sendObject)
                        .success(function(data) {
                            //you also have to do a post to add the comment onto a person's array
                            $ionicLoading.hide();
                            alert("ขอบคุณสำหรับคำเเจ้งความ");
                        }, function(err) {
                            $ionicLoading.hide();
                            alert("เราไม่สามารถเเจ้งความได้ในขณะนี้");
                        });
                } else {

                }
            });
        }

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


                    $http.get("https://ancient-brook-8956.herokuapp.com/find_user/" + $rootScope.uuid)
                        .success(function(user) {
                            $rootScope.user_id = user._id;
                            $rootScope.user_posts = user.posts;
                        })

                    $http.get("https://ancient-brook-8956.herokuapp.com/get_all/" + $rootScope.longt + "/" + $rootScope.lat)
                        .success(function(data) {
                            $rootScope.allMessages = data;
                            for (var i = 0; i < $rootScope.allMessages.length; i++) {
                                //do an underscore contain to check if a user can still vote
                                // console.log($rootScope.allMessages[i].voters);
                                if (_.contains($rootScope.allMessages[i].voters, $rootScope.uuid)) {
                                    $rootScope.allMessages[i].canUpVote = false;
                                    $rootScope.allMessages[i].canDownVote = false;
                                } else {
                                    $rootScope.allMessages[i].canUpVote = true;
                                    $rootScope.allMessages[i].canDownVote = true;
                                }
                            }

                            $ionicLoading.hide();
                            var token = window.localStorage.getItem("token");

                            if (token == null) {
                                $scope.modal.show();
                                window.localStorage.setItem("token", "Done");
                            }
                            $scope.customMessage = ">ไม่มีข้อความในระเเวกนี้"
                            // $scope.modal.show();

                        })
                        .error(function(data) {
                            $scope.customMessage = "ไม่สามารถต่อ server ได้ในขณะนี้ Pull to reload"
                            alert("ไม่สามารถต่อ server ได้ในขณะนี้");
                            $ionicLoading.hide();
                        });

                }, function(err) {
                    $scope.customMessage = "ไม่สามารถหาที่อยู่ของคุณได้ Pull to reload"
                    $ionicLoading.hide();
                });

        });

    })
    .controller('PeekCtrl', function($ionicPopup, $ionicPlatform, $http, $rootScope, $scope, $location, $cordovaGeolocation, $cordovaDevice, $ionicLoading) {
        $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
        });

        angular.element(document).ready(function() {

            $ionicLoading.hide();

            $scope.doRefresh = function() {
                $http.get("https://ancient-brook-8956.herokuapp.com/school_rated/" + $rootScope.peekLong + "/" + $rootScope.peekLat)
                    .success(function(data) {

                        $rootScope.peekArray = [];
                        //set the peek array
                        $rootScope.peekArray = data;
                        $rootScope.peekArray.sort(function(a, b) {
                            return b.rating - a.rating;
                        });

                        $scope.$broadcast('scroll.refreshComplete');

                    })
                    .error(function(data) {
                        alert("ไม่สามารถต่อ server ได้ในขณะนี้");
                    });
            }

            $scope.goToPeek = function() {
                $location.path('/tab/peek/detail');
            }
            $scope.goToPeekDetail = function(peekTitle, latitude, longitude) {

                $rootScope.peekLat = latitude;
                $rootScope.peekLong = longitude;

                $rootScope.peek_title = peekTitle;

                //pass in the latitude and longitude
                //get the highest rated of each university

                $ionicLoading.show({
                    template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
                });

                $http.get("https://ancient-brook-8956.herokuapp.com/school_rated/" + longitude + "/" + latitude)
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
                    alert("โปรดเขียนข้อความ");
                } else {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'คอนเฟิร์ม',
                        template: 'โพสต์ข้อความนี้?'
                    });

                    confirmPopup.then(function(res) {
                        if (res) {
                            $ionicLoading.show({
                                template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
                            });
                            $http.post("https://ancient-brook-8956.herokuapp.com/post_reply", $scope.reply_text)
                                .success(function(data) {
                                    //you also have to do a post to add the comment onto a person's array
                                    $ionicLoading.hide();
                                    $rootScope.selectedMessage.comment.push($scope.reply_text.answer);
                                    $scope.reply_text = {};
                                }, function(err) {
                                    $ionicLoading.hide();
                                    alert("ไม่สามารถโพสต์ข้อความของคุณได้ในขณะนี้");
                                });
                        } else {

                        }
                    });

                }

            };
        });
    })
    .controller('ProfileCtrl', function($http, $scope, $location, $rootScope, $ionicPopup, $ionicLoading) {
        console.log("HProfile ctrl");
        $scope.goToSpecific = function(frontNum) {
            $location.path('/tab/profile/detail');
            $rootScope.selectedNumber = frontNum;
            $rootScope.selectedMessage = $rootScope.user_posts[frontNum];
        };

        $scope.reply_text = {};
        $scope.reply_object = {};

        $scope.submitReply = function() {

            $scope.reply_text.message_id = $rootScope.selectedMessage._id;
            $scope.reply_text.user_id = $rootScope.user_id;

            if ($scope.reply_text.answer.length == 0) {
                alert("ไม่สามารถ downvote ข้อความ");
            } else {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'คอนเฟิร์ม',
                    template: 'โพสต์ข้อความนี้?'
                });

                confirmPopup.then(function(res) {
                    if (res) {
                        $ionicLoading.show({
                            template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
                        });
                        $http.post("https://ancient-brook-8956.herokuapp.com/post_reply", $scope.reply_text)
                            .success(function(data) {
                                //you also have to do a post to add the comment onto a person's array
                                $ionicLoading.hide();
                                $rootScope.selectedMessage.comment.push($scope.reply_text.answer);
                                $scope.reply_text = {};
                            }, function(err) {
                                $ionicLoading.hide();
                                alert("ไม่สามารถโพสต์ข้อความของคุณได้ในขณะนี้");
                            });
                    } else {

                    }
                });

            }
        };

        $scope.refresh = function() {
            $http.get("https://ancient-brook-8956.herokuapp.com/find_user/" + $rootScope.uuid)
                .success(function(user) {
                    $rootScope.user_posts = user.posts;
                })

            $scope.$broadcast('scroll.refreshComplete');

        };


    })
    .controller('MessageCtrl', function($http, $scope, $location, $rootScope, $ionicPopup, $ionicLoading) {
        console.log("Message ctrl");
        $scope.voteUpSpec = function(arrayIndex, messageId) {


            //do an if statement since there is a lag
            //only allow if it is true
            $ionicLoading.show({
                template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
            });

            if ($rootScope.allMessages[$rootScope.selectedNumber].canUpVote == true) {

                $rootScope.allMessages[$rootScope.selectedNumber].canUpVote = false;
                $rootScope.allMessages[$rootScope.selectedNumber].canDownVote = false;


                $rootScope.selectedMessage.canUpVote = false;
                $rootScope.selectedMessage.canDownVote = false;
                $rootScope.selectedMessage.rating++;

                $http.put("https://ancient-brook-8956.herokuapp.com/upvote/" + $rootScope.uuid + "/" + messageId)
                    .success(function(data) {
                        $ionicLoading.hide();
                    }, function(err) {
                        $ionicLoading.hide();
                        alert("ไม่สามารถ upvote ข้อความ");
                    });
            } else {
                $ionicLoading.hide();
            }
        };

        $scope.voteDownSpec = function(arrayIndex, messageId) {

            $ionicLoading.show({
                template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
            });

            if ($rootScope.allMessages[$rootScope.selectedNumber].canDownVote == true) {

                $rootScope.allMessages[$rootScope.selectedNumber].canUpVote = false;
                $rootScope.allMessages[$rootScope.selectedNumber].canDownVote = false;


                $rootScope.selectedMessage.canUpVote = false;
                $rootScope.selectedMessage.canDownVote = false;
                $rootScope.selectedMessage.rating--;

                $http.put("https://ancient-brook-8956.herokuapp.com/downvote/" + $rootScope.uuid + "/" + messageId)
                    .success(function(data) {
                        $ionicLoading.hide();
                    }, function(err) {
                        $ionicLoading.hide();
                        alert("ไม่สามารถ downvote ข้อความ");
                    });
            } else {
                $ionicLoading.hide();
            }


        };


        $scope.reply_text = {};
        $scope.reply_object = {};

        $scope.submitReply = function() {

            $scope.reply_text.message_id = $rootScope.selectedMessage._id;
            $scope.reply_text.user_id = $rootScope.user_id;

            if ($scope.reply_text.answer.length == 0) {
                alert("ไม่สามารถ downvote ข้อความ");
            } else {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'คอนเฟิร์ม',
                    template: 'โพสต์ข้อความนี้?'
                });

                confirmPopup.then(function(res) {
                    if (res) {
                        $ionicLoading.show({
                            template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
                        });
                        $http.post("https://ancient-brook-8956.herokuapp.com/post_reply", $scope.reply_text)
                            .success(function(data) {
                                //you also have to do a post to add the comment onto a person's array
                                $ionicLoading.hide();
                                $rootScope.selectedMessage.comment.push($scope.reply_text.answer);
                                $scope.reply_text = {};
                            }, function(err) {
                                $ionicLoading.hide();
                                alert("ไม่สามารถโพสต์ข้อความของคุณได้ในขณะนี้");
                            });
                    } else {

                    }
                });

            }
        };

    })
    .controller('WriteCtrl', function($timeout, $ionicModal, $ionicPopup, $ionicPlatform, $http, $rootScope, $scope, $location, $cordovaGeolocation, $cordovaDevice, $ionicLoading) {
        console.log("Write");

        $scope.body_text = {
            title: "",
            body: ""
        };


        $scope.writeMessage = function() {

            if ($scope.body_text.title.length > 100 || $scope.body_text.body.length > 200) {
                alert("คุณเขียนเกิน 200 คำ");
            } else if ($scope.body_text.body.length == 0) {
                alert("โปรดเขียนข้อความ");
            } else if(typeof $rootScope.user_id == 'undefined') {
                alert("ไม่สามารถโพสต์ข้อความของคุณได้ในขณะนี้");
            } else {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'คอนเฟิร์ม',
                    template: 'โพสต์ข้อความนี้?'
                });


                confirmPopup.then(function(res) {
                    if (res) {
                        $ionicLoading.show({
                            template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
                        });

                        var posOptions = {
                            timeout: 10000,
                            enableHighAccuracy: false
                        };

                        $cordovaGeolocation
                            .getCurrentPosition(posOptions)
                            .then(function(position) {
                                $rootScope.lat = position.coords.latitude
                                $rootScope.longt = position.coords.longitude


                                $scope.object = {};
                                $scope.object.title = $scope.body_text.title;
                                $scope.object.latitude = $rootScope.lat;
                                $scope.object.longtitude = $rootScope.longt;
                                $scope.object.text = $scope.body_text.body;
                                $scope.object.owner = $rootScope.user_id;

                                $http.post("https://ancient-brook-8956.herokuapp.com/post_message", $scope.object)
                                    .success(function(data) {
                                        //you also have to do a post to add the comment onto a person's array
                                        $ionicLoading.hide();
                                        $scope.body_text = {
                                            title: "",
                                            body: ""
                                        };
                                        alert("โพสต์ข้อความสำเร็จ");
                                    }, function(err) {
                                        $ionicLoading.hide();
                                        alert("ไม่สามารถโพสต์ข้อความของคุณได้ในขณะนี้");
                                    });


                            }, function(err) {
                                alert("ไม่สามารถหาที่อยู่ของคุณได้");
                                $ionicLoading.hide();
                            });

                    } else {

                    }
                });
            }
        }
    });