package com.purui.rrtms.system.service;

import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPFileFilter;
import org.mel.framework.util.GlobalVariables;
import org.springframework.stereotype.Service;

import com.purui.rrtms.system.utils.FTPUtil;

@Service
public class PictureService {
	@Resource
	GlobalVariables globalVariables;

	public void getPicture(String folder, String name, OutputStream os) throws Exception {
		FTPClient client = null;
		try {
			client = FTPUtil.connect(globalVariables.getFtpHost(), globalVariables.getFtpPort(), globalVariables.getFtpUserName(), globalVariables.getFtpPassword());
			client.retrieveFile(folder + '/' + name, os);
		} catch (Exception e) {
			throw e;
		} finally {
			FTPUtil.closeFTPClient(client);
		}
	}

	/**
	 * 基于某张图片的前10张
	 * 
	 * @param folder
	 * @param fileName
	 * @return
	 * @throws Exception
	 */
	public String[] prev(String folder, String fileName) throws Exception {
		FTPClient client = null;
		try {
			client = FTPUtil.connect(globalVariables.getFtpHost(), globalVariables.getFtpPort(), globalVariables.getFtpUserName(), globalVariables.getFtpPassword());
			FTPFile[] listFiles = client.listFiles(folder + '/', new FTPFileFilter() {

				@Override
				public boolean accept(FTPFile file) {
					return !file.isDirectory();
				}
			});

			List<String> fileNames = new ArrayList<>();

			int index = -1;
			for (int i = 0; i < listFiles.length; i++) {
				if (listFiles[i].getName().equals(fileName)) {
					index = i;
					break;
				}
			}

			if (index == -1) {
				return new String[] {};
			}

			for (int i = ((index - globalVariables.getCount()) <= 0 ? 0 : (index - globalVariables.getCount())); i < index; i++) {
				fileNames.add(listFiles[i].getName());
			}

			return fileNames.toArray(new String[] {});

		} catch (Exception e) {
			throw e;
		} finally {
			FTPUtil.closeFTPClient(client);
		}
	}

	/**
	 * 基于某张图片的后10张
	 * 
	 * @param folder
	 * @param fileName
	 * @return
	 * @throws Exception
	 */
	public String[] next(String folder, String fileName) throws Exception {
		FTPClient client = null;
		try {
			client = FTPUtil.connect(globalVariables.getFtpHost(), globalVariables.getFtpPort(), globalVariables.getFtpUserName(), globalVariables.getFtpPassword());
			FTPFile[] listFiles = client.listFiles(folder + '/', new FTPFileFilter() {

				@Override
				public boolean accept(FTPFile file) {
					return !file.isDirectory();
				}
			});

			List<String> fileNames = new ArrayList<>();

			int index = -1;
			for (int i = 0; i < listFiles.length; i++) {
				if (listFiles[i].getName().equals(fileName)) {
					index = i;
					break;
				}
			}
System.out.println("找到文件" + fileName + "位置 " + index + " of  " + listFiles.length);
			if (index == -1) {
				return new String[] {};
			}

			for (int i = index + 1; i < ((index + 1 + globalVariables.getCount()) > listFiles.length ? listFiles.length : (index + 1 + globalVariables.getCount())); i++) {
				fileNames.add(listFiles[i].getName());
			}

			return fileNames.toArray(new String[] {});

		} catch (Exception e) {
			throw e;
		} finally {
			FTPUtil.closeFTPClient(client);
		}
	}

	/**
	 * 某一天的最新10张图片
	 * 
	 * @param folder
	 * @param date
	 * @return
	 * @throws Exception
	 */
	public String[] queryByDate(String folder, Date date, Integer count) throws Exception {
		FTPClient client = null;
		try {
			client = FTPUtil.connect(globalVariables.getFtpHost(), globalVariables.getFtpPort(), globalVariables.getFtpUserName(), globalVariables.getFtpPassword());
			boolean latest = false;
			if (date == null) {
				date = new Date();
				latest = true;
			}
			final String dateStr = new SimpleDateFormat("yyyyMMdd").format(date);
			FTPFile[] listFiles = client.listFiles(folder + '/', new FTPFileFilter() {

				@Override
				public boolean accept(FTPFile file) {
					if (file.isDirectory()) {
						return false;
					}
					return file.getName().indexOf(dateStr) != -1;
				}
			});

			List<String> fileNames = new ArrayList<>();

			if (count == null || count == 0) {
				count = globalVariables.getCount();
			}

			if (listFiles.length <= count) {
				for (FTPFile f : listFiles) {
					fileNames.add(f.getName());
				}
			} else {
				if (latest) {
					for (int i = listFiles.length - count; i < listFiles.length; i++) {
						fileNames.add(listFiles[i].getName());
					}
				} else {
					for (int i = 0; i < count; i++) {
						fileNames.add(listFiles[i].getName());
					}
				}
			}

			return fileNames.toArray(new String[] {});

		} catch (Exception e) {
			throw e;
		} finally {
			FTPUtil.closeFTPClient(client);
		}
	}
}
