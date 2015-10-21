package org.mel.framework.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.Closeable;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GenericMethod {
	private static final Logger logger = LoggerFactory.getLogger(GenericMethod.class);

	public static Object depthClone(Object srcObj) {
		ByteArrayInputStream bis = null;
		ObjectInputStream ois = null;
		ByteArrayOutputStream bos = null;
		ObjectOutputStream oos = null;

		Object dest = null;

		try {
			bos = new ByteArrayOutputStream();
			oos = new ObjectOutputStream(bos);
			oos.writeObject(srcObj);

			bis = new ByteArrayInputStream(bos.toByteArray());
			ois = new ObjectInputStream(bis);
			dest = ois.readObject();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			close(oos);
			close(bos);
			close(ois);
			close(bis);
		}
		return dest;
	}

	public static void close(Closeable closeable) {
		try {
			if (closeable != null) {
				closeable.close();
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
	}

	public static String parseThrowable(Throwable e) {
		if (e == null) {
			return "Empty Thrable";
		}
		StringWriter sw = new StringWriter();
		PrintWriter pw = new PrintWriter(sw);
		e.printStackTrace(pw);
		String message = sw.toString();
		if (sw != null) {
			try {
				sw.close();
			} catch (IOException e1) {
			}
		}
		if (pw != null) {
			pw.close();
		}
		return message;
	}

	public static boolean isAjaxRequest(HttpServletRequest request) {
		String requestedWith = request.getHeader("X-Requested-With");
		return requestedWith != null ? "XMLHttpRequest".equals(requestedWith) : false;
	}

	public static String encodeFile(File file) {
		return new String(Base64.encodeBase64(file2Byte(file)));
	}

	public static String encodeFile(InputStream is) {
		return new String(Base64.encodeBase64(file2Byte(is)));
	}

	private static byte[] file2Byte(File file) {
		InputStream is = null;

		try {
			is = new FileInputStream(file);
			return file2Byte(is);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		} finally {
			if (is != null) {
				close(is);
			}
		}
		return null;

//		@formatter:off
		/*InputStream is = null;
		ByteArrayOutputStream os = null;

		try {
			is = new FileInputStream(file);
			os = new ByteArrayOutputStream(2048);
			byte[] buffer = new byte[2048];
			int size = 0;
			while ((size = is.read(buffer, 0, 2048)) != -1) {
				os.write(buffer, 0, size);
			}
			return os.toByteArray();
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		} finally {
			if (os != null) {
				close(os);
				close(is);
			}
		}
		return null;*/
//		@formatter:on

	}

	private static byte[] file2Byte(InputStream is) {
		ByteArrayOutputStream os = null;

		try {
			os = new ByteArrayOutputStream(2048);
			byte[] buffer = new byte[2048];
			int size = 0;
			while ((size = is.read(buffer, 0, 2048)) != -1) {
				os.write(buffer, 0, size);
			}
			return os.toByteArray();
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		} finally {
			if (os != null) {
				close(os);
			}
		}
		return null;
	}

	public static String generateGirl() {
		return generateGirl("");
	}

	public static String generateGirl(String message) {
		if (message == null) {
			message = "";
		}
		String NEWLINE = System.getProperty("line.separator");
		StringBuffer buff = new StringBuffer();
		buff.append("\r\n");
		buff.append("                              ");
		buff.append(".::::.                    ");
		buff.append(NEWLINE);
		buff.append("     ");
		buff.append("                ");
		buff.append("       .:::::");
		buff.append(":::.                  ");
		buff.append(NEWLINE);
		buff.append("                            :::::::::::                 ");
		buff.append(NEWLINE);
		buff.append("           ");
		buff.append("                 ':::::::::::..              ");
		buff.append(NEWLINE);
		buff.append("                             ::::");
		buff.append(":::::::::::'           ");
		buff.append(NEWLINE);
		buff.append("                              ':::::::::::.             ");
		buff.append(NEWLINE);
		buff.append("                                .::::::::");
		buff.append("::::::'        ");
		buff.append(NEWLINE);
		buff.append("                              ");
		buff.append(".:::::::::::...      ").append(message);
		buff.append(NEWLINE);
		buff.append("                             ::::::::::::::''");
		buff.append("           ");
		buff.append(NEWLINE);
		buff.append("                 .:::.       '::::::::''::::            ");
		buff.append(NEWLINE);
		buff.append("               .::::::::.  ");
		buff.append("    ':::::'  '::::           ");
		buff.append(NEWLINE);
		buff.append("              ");
		buff.append(".::::':::::::.   ");
		buff.append(" :::::    '::::.         ");
		buff.append(NEWLINE);
		buff.append("            .:::::' '::::");
		buff.append(":::::. :::::      ':::.        ");
		buff.append(NEWLINE);
		buff.append("          .:::::'     ':::::::::.:::::   ");
		buff.append("    '::.       ");
		buff.append(NEWLINE);
		buff.append("        .::::''         '::::::::::::::       '::.      ");
		buff.append(NEWLINE);
		buff.append("       .::''              ':::::");
		buff.append(":::::::         :::...  ");
		buff.append(NEWLINE);
		buff.append("    ..::::                  ':::::::::'     ");
		buff.append("   .:' '''' ");
		buff.append(NEWLINE);
		buff.append(" ..''''':'                    ':::::.'                  ");
		buff.append(NEWLINE);
		buff.append("\r\n");
		return buff.toString();
	}
}
