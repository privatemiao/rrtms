package com.purui.rrtms.system.ctrl;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.mel.framework.domain.JSonPageWrapper;
import org.mel.framework.domain.JsonResponse;
import org.mel.framework.domain.Page;
import org.mel.framework.domain.Paged;
import org.mel.security.domain.Authentication;
import org.mel.security.domain.CachedUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.purui.rrtms.system.domain.EnergyEntity;
import com.purui.rrtms.system.domain.EnergyOfMonth;
import com.purui.rrtms.system.domain.HDataMon;
import com.purui.rrtms.system.domain.PositionArea;
import com.purui.rrtms.system.domain.StationRun;
import com.purui.rrtms.system.domain.TotalLoad;
import com.purui.rrtms.system.domain.TotalLoadOfMonth;
import com.purui.rrtms.system.domain.UserDataPointParam;
import com.purui.rrtms.system.entity.Chart;
import com.purui.rrtms.system.entity.DataPoint;
import com.purui.rrtms.system.entity.Point;
import com.purui.rrtms.system.entity.Station;
import com.purui.rrtms.system.entity.User;
import com.purui.rrtms.system.entity.UserDataPoint;
import com.purui.rrtms.system.entity.Video;
import com.purui.rrtms.system.service.DataPointService;
import com.purui.rrtms.system.service.StationService;
import com.purui.rrtms.system.service.SystemService;

@Controller
@RequestMapping("/system/station/")
public class StationAction {
	private static Logger logger = LoggerFactory.getLogger(StationAction.class);
	@Resource
	private StationService stationService;
	@Resource
	private DataPointService dataPointService;
	@Resource
	private SystemService systemService;

	@Authentication("com.purui.rrtms.system.station")
	@RequestMapping("showstationpage")
	public String stationPage() {
		return "system/station";
	}

	@RequestMapping("stations")
	@ResponseBody
	public JSonPageWrapper<Station> query(Page page, String param) {

		CachedUser cachedUser = systemService.getCurrentUser();

		if (!cachedUser.isAdmin() && !cachedUser.isInternal()) {
			final User user = (User) cachedUser.getData(User.class.getCanonicalName());
			return new JSonPageWrapper<>(new Paged<Station>() {

				@Override
				public Class<Station> getClazz() {
					return Station.class;
				}

				@Override
				public int getCount() {
					return user.getStations().size();
				}

				@Override
				public int getStartPosition() {
					return 0;
				}

				@Override
				public List<Station> getData() {
					return user.getStations();
				}

				@Override
				public int getMaxCount() {
					return user.getStations().size();
				}

			});
		}

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("page", page);
		map.put("param", param);
		Paged<Station> paged = stationService.query(map);
		return new JSonPageWrapper<>(paged);
	}

	@Authentication(value = "com.purui.rrtms.system.station.view", desc = "站点列表")
	@RequestMapping("station/{id}")
	@ResponseBody
	public Station loadStation(@PathVariable Long id) {
		return stationService.loadStation(id);
	}

	@RequestMapping("stationbycode/{code}")
	@ResponseBody
	public Station loadStationByCode(@PathVariable("code") String code) {
		return stationService.loadStationByCode(code);
	}

	@RequestMapping("{code}/datapointhierarchy")
	@ResponseBody
	public Station loadDataPointHierarchy(@PathVariable("code") String code) {
		return stationService.loadDataPointHierarchy(code);
	}

	@RequestMapping("point/{id}/datapoints")
	@ResponseBody
	public JSonPageWrapper<DataPoint> queryDataPoint(@PathVariable Long id, Page page, String code) {
		Map<String, Object> map = new HashMap<>();
		map.put("page", page);
		map.put("id", id);
		map.put("code", code);
		return new JSonPageWrapper<>(dataPointService.query(map));
	}

	@RequestMapping("point/datapoint/{id}/todefault")
	@ResponseBody
	public JsonResponse setDataPointDefault(@PathVariable Long id) {
		dataPointService.saveDataPointDefault(id);
		return new JsonResponse("操作成功！", JsonResponse.STATUS.SUCCESS);
	}

	@RequestMapping("{code}/point/defaultdatapoint")
	@ResponseBody
	public DataPoint getDefaultDataPoint(@PathVariable("code") String code) {
		return dataPointService.findDefaultByCode(code);
	}

	@RequestMapping("{code}/chartdesign")
	public String chartDesign(@PathVariable("code") String code, HttpServletResponse response) {
		response.addCookie(new Cookie("code", code));
		return "system/chartdesign";
	}

	@RequestMapping("{code}/charts")
	@ResponseBody
	public List<Chart> loadChartsByCode(@PathVariable("code") String code) {
		return stationService.loadChartsByCode(code);
	}

	@RequestMapping("removechart/{id}")
	@ResponseBody
	public JsonResponse removeChart(@PathVariable("id") Long id) {
		stationService.removeChart(id);
		return new JsonResponse(JsonResponse.MESSAGE_REMOVE_SUCCESS, JsonResponse.STATUS.SUCCESS);
	}

	@RequestMapping("chart/{id}")
	@ResponseBody
	public Chart loadChart(@PathVariable("id") Long id) {
		return stationService.loadChart(id);
	}

	@RequestMapping("{code}/chart/save")
	@ResponseBody
	public JsonResponse saveChart(@PathVariable("code") String code, Chart chart) {
		chart.setStation(stationService.loadStationByCode(code));
		if (StringUtils.isBlank(chart.getData())) {
			chart.setData("[]");
		}
		stationService.saveChart(chart);
		return new JsonResponse(JsonResponse.MESSAGE_SAVE_SUCCESS, chart, JsonResponse.STATUS.SUCCESS);
	}

	@RequestMapping("{code}/chartviewpage")
	public String chartViewPage(@PathVariable("code") String code, HttpServletResponse response) {
		response.addCookie(new Cookie("code", code));
		return "system/chartview";
	}

	@RequestMapping("{code}/{tagId}/triggerswitch/{operate}")
	@ResponseBody
	public JsonResponse triggerSwitch(@PathVariable("code") String code, @PathVariable("tagId") String tagId, @PathVariable("operate") String operate, String note, String password) {
		try {
			String result = stationService.triggerSwitch(code, tagId, operate, note, password);
			return new JsonResponse(JsonResponse.MESSAGE_EXECUTE_SUCCESS, result, JsonResponse.STATUS.SUCCESS);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return new JsonResponse(JsonResponse.MESSAGE_EXECUTE_FAILURE + "[" + e.getMessage() + "]", JsonResponse.STATUS.FAILURE);
		}
	}

	@RequestMapping("showstationdistpage")
	public String stationDistPage() {
		return "system/stationdist";
	}

	@RequestMapping("stationsbyuser")
	@ResponseBody
	public JSonPageWrapper<Station> queryByUser(Page page, String param) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("page", page);
		map.put("param", param);
		map.put("userId", ((User) systemService.getCurrentUser().getData(User.class.getCanonicalName())).getId());
		Paged<Station> paged = stationService.queryByUser(map);
		return new JSonPageWrapper<>(paged);
	}

	@RequestMapping("stationsbyarea")
	@ResponseBody
	public List<Station> stationsByArea(PositionArea positions) {
		Map<String, Object> map = new HashMap<>();
		Page page = new Page();
		page.setCount(Integer.MAX_VALUE);
		page.setSkip(0);
		map.put("page", page);
		map.put("positions", positions);
		map.put("userId", ((User) systemService.getCurrentUser().getData(User.class.getCanonicalName())).getId());
		Paged<Station> paged = stationService.queryByUser(map);
		logger.debug("STATIONBYAREA>>SIZE>>" + paged.getData().size());

		try {
			Thread.sleep(500);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		return paged.getData();
	}

	@RequestMapping("{code}/detail")
	public String stationDetailPage(@PathVariable("code") String code, HttpServletResponse response) {
		response.addCookie(new Cookie("code", code));
		return "system/stationdetail";
	}

	@RequestMapping("{code}/datapoint/history")
	@ResponseBody
	public List<HDataMon> dataPointHistory(@PathVariable("code") String code, Date startDate, Date endDate, String guid) {
		return stationService.getDataPointHistory(code, startDate, endDate, guid);
	}

	@RequestMapping(value = "{code}/userdatapoints", method = RequestMethod.POST)
	@ResponseBody
	public JsonResponse saveUserDefaultDataPoints(@PathVariable("code") String code, UserDataPointParam param) {
		stationService.saveUserDataPoint(code, param.getUserDataPoints());
		return new JsonResponse(JsonResponse.MESSAGE_SAVE_SUCCESS, null, JsonResponse.STATUS.SUCCESS);
	}

	@RequestMapping(value = "{code}/userdatapoints", method = RequestMethod.GET)
	@ResponseBody
	public List<UserDataPoint> getUserDataPoint(@PathVariable("code") String code) {
		return stationService.getUserDataPoint(code);
	}

	@RequestMapping("{code}/video")
	public String showVideo(@PathVariable("code") String code) {
		return "system/video";
	}

	@RequestMapping("{code}/videos")
	@ResponseBody
	public List<Video> getVides(@PathVariable("code") String code) {
		return stationService.getVideosByCode(code);
	}

	@RequestMapping("{code}/run")
	@ResponseBody
	public StationRun loadStationRun(@PathVariable("code") String code) {
		return stationService.getStationRun(code);
	}

	@RequestMapping("picturepage")
	public String picturePage() {
		return "system/station/picture";
	}

	@RequestMapping("{code}/maxenergyofday")
	@ResponseBody
	public EnergyEntity maxEnergyOfDay(@PathVariable("code") String code, Date date) {
		return stationService.maxEnergyOfDay(code, date);
	}

	@RequestMapping("{code}/maxloadofday")
	@ResponseBody
	public TotalLoad maxLoadOfDay(@PathVariable("code") String code, Date date) {
		return stationService.maxLoadOfDay(code, date);
	}

	@RequestMapping("{code}/energyofmonth")
	@ResponseBody
	public EnergyOfMonth energyOfMonth(@PathVariable("code") String code, Date date) {
		return stationService.energyOfMonth(code, date);
	}
	
	@RequestMapping("{code}/totalloadofmonth")
	@ResponseBody
	public TotalLoadOfMonth totalLoadOfMonth(@PathVariable("code") String code, Date date){
		return stationService.getTotalLoadOfMonth(code, date);
	}
	
	@RequestMapping("{code}/points")
	@ResponseBody
	public List<Point> pointsByCode(@PathVariable("code") String code){
		return stationService.getPoints(code);
	}
	
//	@RequestMapping("point/{id}/runtimedata")
//	@ResponseBody
//	public String pointRuntimeData(@PathVariable("id") String id){
//		return stationService.getPointRuntimeData(id);
//	}
}
