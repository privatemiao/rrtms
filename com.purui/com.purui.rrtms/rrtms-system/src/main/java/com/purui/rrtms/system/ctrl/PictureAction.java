package com.purui.rrtms.system.ctrl;

import java.util.Date;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.mel.framework.util.GenericMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.purui.rrtms.system.service.PictureService;

@Controller
@RequestMapping("system/picture/")
public class PictureAction {
	protected Logger logger = LoggerFactory.getLogger(PictureAction.class);

	@Resource
	private PictureService pictureService;

	@RequestMapping("{folder}/query")
	@ResponseBody
	public String[] query(@PathVariable("folder") String folder, Date date, Integer count) throws Exception {
		if (date == null) {
			date = new Date();
		}

		return pictureService.queryByDate(folder, date, count);
	}

	@RequestMapping("{folder}/next")
	@ResponseBody
	public String[] next(@PathVariable("folder") String folder, String fileName) throws Exception {
		return pictureService.next(folder, fileName);
	}
	
	@RequestMapping("{folder}/prev")
	@ResponseBody
	public String[] prev(@PathVariable("folder") String folder, String fileName) throws Exception {
		return pictureService.prev(folder, fileName);
	}

	@RequestMapping("{folder}/{fileName}.{suffix}")
	public void getPicture(@PathVariable("folder") String folder, @PathVariable("fileName") String fileName, @PathVariable("suffix") String suffix, HttpServletResponse response) throws Exception {
		ServletOutputStream os = null;

		try {
			os = response.getOutputStream();
			pictureService.getPicture(folder, fileName + '.' + suffix, os);
			os.flush();
		} catch (Exception e) {
			throw e;
		} finally {
			GenericMethod.close(os);
		}
	}
}
