package com.purui.rrtms.system.utils;

import java.io.IOException;
import java.net.SocketException;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;

public class FTPUtil {
	public static FTPClient connect(String host, int port, String userName, String password) throws SocketException, IOException {
		FTPClient client = new FTPClient();
		client.connect(host, port);
		if (FTPReply.isPositiveCompletion(client.getReplyCode())) {
			if (client.login(userName, password)) {
				return client;
			}
		}
		System.out.println("FtpServer not ready!");
		return null;
	}

	public static void closeFTPClient(FTPClient client) {
		try {
			if (client != null && client.isConnected()) {
				client.logout();
				client.disconnect();
			}
		} catch (Exception e) {
		}
	}

}
