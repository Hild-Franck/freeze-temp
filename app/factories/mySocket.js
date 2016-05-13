/**
 * Created by Knarfux on 04/05/2016.
 */

myApp.factory('socket', ['socketFactory', function(socketFactory){
    var myIoSocket = io.connect('http://10.31.0.223:4000');
    console.log(myIoSocket);


    var mySocket = socketFactory({
        ioSocket: myIoSocket
    });



    return mySocket;
}]);