package com.purui.rrtms.system.ctrl;

import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.purui.rrtms.system.domain.AnalysisActionParam;
import com.purui.rrtms.system.domain.AnalysisEnergyParam;
import com.purui.rrtms.system.domain.AnalysisEnergyWrapper;
import com.purui.rrtms.system.domain.AnalysisLoadWrapper;
import com.purui.rrtms.system.domain.AnalysisPowerIndicatorParam;
import com.purui.rrtms.system.entity.Point;
import com.purui.rrtms.system.service.AnalysisEnergyService;
import com.purui.rrtms.system.service.AnalysisService;

@Controller
@RequestMapping("/system/analysis/")
public class AnalysisAction {
	protected Logger logger = LoggerFactory.getLogger(AnalysisAction.class);

	@Resource
	private AnalysisService analysisService;

	@Resource
	private AnalysisEnergyService analysisEnergyService;

	@RequestMapping("loadpage")
	public String loadPage() {
		return "system/analysis/load";
	}

	@RequestMapping("load/compare")
	@ResponseBody
	public List<AnalysisLoadWrapper> loadCompare(AnalysisActionParam param) {
		logger.debug("loadCompare>>" + param.toString());
		return analysisService.compareLoad(param);
	}

	@RequestMapping("energypage")
	public String energyPage() {
		return "system/analysis/energy";
	}

	@RequestMapping("energy/compare")
	@ResponseBody
	public List<AnalysisEnergyWrapper> energyCompare(AnalysisActionParam param) {
		logger.debug("energyCompare>>" + param.toString());
		return analysisEnergyService.compareEnergy(param);
	}
	
	@RequestMapping("powerIndicator")
	@ResponseBody
	public Point powerIndicator(AnalysisPowerIndicatorParam param){
		return analysisService.powerIndicator(param);
	}
	
	@RequestMapping("energy")
	@ResponseBody
	public List<Point> energyAnalysis(AnalysisEnergyParam param){
		return analysisEnergyService.searchPointMData(param);
	}
}
