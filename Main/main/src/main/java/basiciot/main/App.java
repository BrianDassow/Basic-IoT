package basiciot.main;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;
import java.util.TimerTask;

import javax.swing.Timer;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;

public class App {
	
    static SocketIOServer socketIoServer = null;
    static Timer t;

    public static void main(String[] args) throws Exception {

        
        //Socket.io server config    
        Configuration config = new Configuration();
        config.setHostname("localhost");
        config.setHeartbeatInterval(1);
        config.setPort(5000);
        
        socketIoServer = new SocketIOServer(config);
        //socketIoServer = SocketIOServer.newInstance(5000);
       // config.setAllowCustomRequests(true);
        System.out.println(config.isAllowCustomRequests());
        socketIoServer.addConnectListener(new ConnectListener() {
        	
			public void onConnect(SocketIOClient arg0) {
				System.out.println("Connect");
			}
        	
        });
        
        socketIoServer.addDisconnectListener(new DisconnectListener() {
            public void onDisconnect(SocketIOClient client) {
                System.out.println("onDisconnected");
            }
        });
       
        
        
        //Listen for "GET_HISTORICAL_TOPIC_DATA" from web application
        socketIoServer.addEventListener("GET_HISTORICAL_TOPIC_DATA", String.class, new DataListener<String>() {
			public void onData(SocketIOClient socket, String topic, AckRequest useless) {
				System.out.println("lol");
			}
        });
        
        //Start Socket.IO server
        socketIoServer.start();
        System.out.println("Socket.IO server listening");
        
        
        
        
        
        
        
        

            t = null;
            t = new Timer(2000,new ActionListener() {
                public void actionPerformed(ActionEvent e) {
                   // System.out.println("Printing statement after every 2 seconds");
                    if (socketIoServer != null) {
                    	socketIoServer.getBroadcastOperations().sendEvent("backendStuff", null);
                    }
                    //t.stop(); // if you want only one print uncomment this line
                }
            });

            java.util.Timer tt = new java.util.Timer(false);
            tt.schedule(new TimerTask() {
                public void run() {
                    t.start();
                }
            }, 0);
        
        
        
        
        
        
        
    }
}