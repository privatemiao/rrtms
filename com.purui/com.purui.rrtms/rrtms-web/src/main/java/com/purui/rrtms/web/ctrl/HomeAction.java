package com.purui.rrtms.web.ctrl;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.UUID;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.mel.framework.domain.JsonResponse;
import org.mel.framework.util.GenericMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.purui.rrtms.system.service.SystemService;
import com.purui.rrtms.web.io.redis.PubSubService;

@Controller
public class HomeAction {
	protected Logger logger = LoggerFactory.getLogger(HomeAction.class);

	@Resource
	private SystemService systemService;

	@Resource
	private PubSubService pubSubService;

	@RequestMapping({ "/", "home", "/index.html", "/default.html" })
	public String defaultPage() {
		return "home";
	}

	@RequestMapping("loginpage")
	public String loginPage() {
		return "login";
	}

	@RequestMapping("login")
	@ResponseBody
	public JsonResponse login(String loginId, String password, String clientId, String devType) {
		logger.debug("login>>" + loginId + ", " + password);
		systemService.login(loginId, password);
		if (!StringUtils.isBlank(clientId) && !StringUtils.isBlank(devType)) {
			systemService.saveClient(clientId, devType);
		}
		return new JsonResponse("登录成功！", null, JsonResponse.STATUS.SUCCESS);
	}

	@RequestMapping("logout")
	public String logout() {
		systemService.logout();
		return "login";
	}

	@RequestMapping("dashboard")
	public String dashboard() {
		return "dashboard";
	}

	@RequestMapping("chartmap")
	public String chartmap() {
		return "map";
	}

	@RequestMapping(value = "profile", method = RequestMethod.POST)
	@ResponseBody
	public JsonResponse changeProfile() {
		return null;
	}

	// download file
	@RequestMapping("{type}/download/{fileName}.{ext}")
	public void download(@PathVariable("type") String type, @PathVariable("fileName") String fileName, @PathVariable("ext") String ext, HttpServletResponse response) {
		String uploadLocation = System.getProperties().getProperty("user.home") + File.separator + "upload" + File.separator + type;
		// String completeFileName = uploadLocation + File.separator + fileName
		// + "." + ext;
		String completeFileName = null;
		if (StringUtils.isBlank(ext)) {
			completeFileName = uploadLocation + File.separator + fileName;
		} else {
			completeFileName = uploadLocation + File.separator + fileName + "." + ext;
		}
		File file = new File(completeFileName);

		BufferedInputStream is = null;
		OutputStream os = null;
		byte[] buffer = new byte[2048];
		int count = -1;

		try {
			is = new BufferedInputStream(new FileInputStream(file));
			os = response.getOutputStream();
			while ((count = is.read(buffer, 0, 2048)) != -1) {
				os.write(buffer, 0, count);
			}
			os.flush();
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		} finally {
			GenericMethod.close(os);
			GenericMethod.close(is);
		}
	}

	// upload file
	@RequestMapping("/{type}/upload")
	@ResponseBody
	public JsonResponse upload(@PathVariable("type") String type, boolean convert, @RequestParam MultipartFile file) throws IllegalStateException, IOException {
		logger.debug(type);
		logger.debug(file.getContentType());
		logger.debug(file.getName());
		logger.debug(file.getOriginalFilename());
		logger.debug("Convert: " + convert);

		if (StringUtils.isBlank(type)) {
			throw new IllegalArgumentException("parame type of url.");
		}

		if (convert) {
			String encodedFile = GenericMethod.encodeFile(file.getInputStream());
			return new JsonResponse("上传成功", encodedFile, JsonResponse.STATUS.SUCCESS);
		} else {
			String uploadStr = System.getProperties().getProperty("user.home") + File.separator + "upload" + File.separator + type;
			File uploadDir = new File(uploadStr);
			if (!uploadDir.isDirectory()) {
				uploadDir.mkdirs();
			}
			String newFileName = UUID.randomUUID().toString() + file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.'));
			System.out.println("generate file " + newFileName);
			file.transferTo(new File(uploadStr + File.separator + newFileName));
			return new JsonResponse("上传成功", newFileName, JsonResponse.STATUS.SUCCESS);
		}

	}

	@RequestMapping("getredisdata")
	@ResponseBody
	public String getRedisData(String subject) {
		return pubSubService.getRedisData(subject);
	}

}
