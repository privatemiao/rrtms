package com.purui.rrtms.system.utils;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.SocketException;
import java.util.Date;

import javax.annotation.Resource;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPFileFilter;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mel.framework.util.GenericMethod;
import org.mel.framework.util.GlobalVariables;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.purui.rrtms.system.service.PictureService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class FTPUtilTest {
	@Resource
	GlobalVariables globalVariables;
	@Resource
	PictureService pictureService;

	@Test
	public void testConnect() throws SocketException, IOException {
		FTPClient client = FTPUtil.connect(globalVariables.getFtpHost(), globalVariables.getFtpPort(), globalVariables.getFtpUserName(), globalVariables.getFtpPassword());
		
		FTPFile[] listFiles = client.listFiles("10.45.1.11", new FTPFileFilter() {
			
			@Override
			public boolean accept(FTPFile file) {
				return !file.isDirectory();
			}
		});

		for (FTPFile file : listFiles){
			System.out.println(file.getName());
		}
		
		FTPUtil.closeFTPClient(client);
	}

	@Test
	public void testQueryByDate() throws Exception {
		String[] names = pictureService.queryByDate("10.45.1.11", new Date(), 10);
		for (String name : names){
			System.out.println(name);
		}
	}
	
	@Test
	public void testPrev() throws Exception{
		String[] next = pictureService.prev("10.45.1.11", "10.45.1.11_01_20140723174205_MOTDEC.jpg");
		for (String str : next){
			System.out.println(str);
		}
	}
	
	@Test
	public void testNext() throws Exception{
		String[] next = pictureService.next("10.40.1.11", "10.40.1.11_01_20140724080520_MOTDEC.jpg");
		for (String str : next){
			System.out.println(str);
		}
	}
	
	@Test
	public void testGetPicture() throws FileNotFoundException, Exception{
		OutputStream os = null;
		String folderName = "beauty";
		String fileName = "044-f9e49a6c29f12ffff0f4f5272de77e8d.jpg";
		try {
			os = new FileOutputStream("D:/tmp/" + fileName);
			pictureService.getPicture(folderName, fileName, os);
		} catch (Exception e) {
			GenericMethod.close(os);
		}
		
	}
}
