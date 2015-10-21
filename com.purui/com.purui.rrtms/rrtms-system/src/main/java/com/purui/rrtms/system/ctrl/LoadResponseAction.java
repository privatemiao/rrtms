package com.purui.rrtms.system.ctrl;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mel.framework.domain.JSonPageWrapper;
import org.mel.framework.domain.JsonResponse;
import org.mel.framework.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.purui.rrtms.system.domain.ControlInstruction;
import com.purui.rrtms.system.domain.ControlInstructionResponse;
import com.purui.rrtms.system.domain.ControlInstructionResult;
import com.purui.rrtms.system.domain.LoadControlApplyParam;
import com.purui.rrtms.system.domain.StationRun;
import com.purui.rrtms.system.domain.TotalLoad;
import com.purui.rrtms.system.service.LoadResponseService;

/**
 * 负荷响应查询
 * 
 * @author mel
 * 
 */
@Controller
@RequestMapping("/system/loadresponse/")
public class LoadResponseAction {
	@Resource
	private LoadResponseService loadResponseService;

	@RequestMapping("control")
	public String controlPage() {
		return "system/loadresponse/control";
	}

	@RequestMapping("solution")
	public String solutionPage() {
		return "system/loadresponse/solution";
	}

	@RequestMapping("areaload")
	@ResponseBody
	public List<StationRun> areaLoad(String areaName) {
		return loadResponseService.areaLoad(areaName);
	}

	// 基准值
	@RequestMapping("{code}/basetotalload")
	@ResponseBody
	public TotalLoad baseTotalLoad(@PathVariable String code, Date startDate, Date endDate) {
		if (startDate == null) {
			startDate = new Date(System.currentTimeMillis() - (24 * 60 * 60 * 1000));
		}
		if (endDate == null) {
			endDate = startDate;
		}
		return loadResponseService.baseTotalLoad(code, startDate, endDate);
	}

	@RequestMapping("applyinstruction")
	@ResponseBody
	public JsonResponse submitInstruction(LoadControlApplyParam param) {
		try {
			String result = loadResponseService.submitInstruction(param);
			return new JsonResponse("指令提交成功！", result, JsonResponse.STATUS.SUCCESS);
		} catch (Exception e) {
			return new JsonResponse("指令提交失败！" + e.getMessage(), JsonResponse.STATUS.FAILURE);
		}
	}

	@RequestMapping("query")
	@ResponseBody
	public JSonPageWrapper<ControlInstruction> queryInstruction(Page page, Boolean history) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("page", page);
		map.put("history", history);
		return new JSonPageWrapper<>(loadResponseService.queryControlInstruction(map));
	}

	@RequestMapping("detail/{guid}")
	public String instructionDetail(@PathVariable String guid) {
		return "system/loadresponse/detail";
	}

	@RequestMapping("instruction/{guid}")
	@ResponseBody
	public ControlInstruction loadInstruction(@PathVariable String guid) {
		return loadResponseService.loadInstruction(guid);
	}

	@RequestMapping("instructionresultinfo/{guid}")
	@ResponseBody
	public List<ControlInstructionResult> loadInsResultByGuid(@PathVariable String guid) {
		return loadResponseService.loadInsResultByGuid(guid);
	}

	@RequestMapping("loadResponsesolution/{guid}")
	@ResponseBody
	public List<ControlInstructionResponse> loadResponseSolution(@PathVariable String guid) {
		return loadResponseService.loadInsResponse(guid);
	}
}
