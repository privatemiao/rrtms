package com.purui.rrtms.system.service;

import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.Writer;
import java.net.Socket;
import java.security.KeyStore;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManagerFactory;

import org.mel.framework.util.GenericMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SSLService {
	protected Logger logger = LoggerFactory.getLogger(SSLService.class);

	private String password = "123456";

	private String host = "222.92.76.45";

	private int port = 7890;

	private String keyStore = "puruiServer.keystore";

	public String send(String message) throws Exception {
		Socket socket = null;

		Writer writer = null;
		Reader reader = null;

		try {
			socket = getSSLSocket();
			writer = new OutputStreamWriter(socket.getOutputStream(), "UTF-8");
			writer.write(message);
			writer.write("EOF");
			writer.flush();
			System.out.println("Writen>>" + message);

			reader = new InputStreamReader(socket.getInputStream(), "UTF-8");

			int len = -1;
			char chars[] = new char[1024];
			int index = -1;
			StringBuffer buffer = new StringBuffer();

			while ((len = reader.read(chars)) != -1) {
				String tmp = new String(chars, 0, len);
				if ((index = tmp.indexOf("EOF")) != -1) {
					buffer.append(tmp.substring(0, index));
					break;
				}
				buffer.append(new String(chars, 0, len));
			}
			return buffer.toString();
		} catch (Exception e) {
			StringBuffer buffer = new StringBuffer();
			buffer.append(e.getMessage());
			buffer.append("|host:").append(host).append("|port:").append(port);
			logger.error(e.getMessage(), e);
			throw e;
		} finally {
			GenericMethod.close(writer);
			GenericMethod.close(reader);
			GenericMethod.close(socket);
		}
	}

	private Socket getSSLSocket() throws Exception {
		KeyStore keyStore = KeyStore.getInstance("JKS");
		keyStore.load(this.getClass().getResourceAsStream(getKeyStore()), password.toCharArray());
		TrustManagerFactory tmf = TrustManagerFactory.getInstance("SunX509");
		tmf.init(keyStore);

		SSLContext context = SSLContext.getInstance("SSL");
		context.init(null, tmf.getTrustManagers(), null);
		return context.getSocketFactory().createSocket(host, port);
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public int getPort() {
		return port;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public String getKeyStore() {
		return keyStore;
	}

	public void setKeyStore(String keyStore) {
		this.keyStore = keyStore;
	}

	@Override
	public String toString() {
		return "SSLService [password=" + password + ", host=" + host + ", port=" + port + ", keyStore=" + keyStore + "]";
	}


}
