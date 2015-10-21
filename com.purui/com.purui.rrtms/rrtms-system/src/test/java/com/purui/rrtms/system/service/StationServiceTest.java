package com.purui.rrtms.system.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mel.framework.dao.BaseDao;
import org.mel.framework.domain.Page;
import org.mel.framework.domain.Paged;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.purui.rrtms.system.domain.EnergyEntity;
import com.purui.rrtms.system.domain.EnergyOfMonth;
import com.purui.rrtms.system.domain.HDataMon;
import com.purui.rrtms.system.domain.TotalLoadOfMonth;
import com.purui.rrtms.system.entity.Chart;
import com.purui.rrtms.system.entity.Station;
import com.purui.rrtms.system.entity.Video;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class StationServiceTest {
	@Resource
	StationService stationService;
	@Resource
	BaseDao baseDao;

	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testQuery() {
		Page page = new Page();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("page", page);
		map.put("param", "鹅荡路");
		Paged<Station> paged = stationService.query(map);
		for (Station station : paged.getData()) {
			System.out.println(station);
		}
	}

	@Test
	public void testLoadStation() {
		Station station = stationService.loadStation(1l);
		System.out.println(station);
	}

	@Test
	public void testloadChartsByCode() {
		List<Chart> charts = stationService.loadChartsByCode("PUHUA");
		for (Chart chart : charts) {
			System.out.println(chart);
		}
	}

	@Test
	public void testloadDataPointHierarchy() {
		stationService.loadDataPointHierarchy("XQDX");
	}
	
	@Test
	public void testJPQL(){
		Paged<Station> paged = new Paged<Station>() {

			@Override
			public String getSql() {
				return "SELECT a FROM Station a LEFT JOIN a.users b WHERE b.id = 1";
			}

			@Override
			public Class<Station> getClazz() {
				return Station.class;
			}

			@Override
			public int getCount() {
				return 10;
			}

			@Override
			public int getStartPosition() {
				return 0;
			}
		};
		
		baseDao.search(paged);
		for (Station station : paged.getData()){
			System.out.println(station);
		}
	}
	
	@Test
	public void testByUser(){
		Page page = new Page();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("page", page);
		map.put("param", "污水");
		map.put("userId", 1L);
		Paged<Station> paged = stationService.queryByUser(map);
		for (Station station : paged.getData()) {
			System.out.println(station);
		}
	}
	
	@Test
	public void testHistory(){
		List<HDataMon> historys = stationService.getDataPointHistory("XQDX", new Date(), new Date(), "b969d5ab-c5a4-4fa1-be5b-e0b66db71da6");
		System.out.println("SIZE>>" + historys.size());
		for (HDataMon h : historys){
			System.out.println(h);
		}
	}
	
	@Test
	public void testFindVideos(){
		List<Video> videos = stationService.getVideosByCode("BEGJ");
		
		for (Video v : videos){
			System.out.println(v);
		}
		
		System.out.println(videos.size());
	}
	
	@Test
	public void testEnergyByDay() throws ParseException{
		EnergyEntity energy = stationService.maxEnergyOfDay("XQDX", new SimpleDateFormat("yyyy-MM-dd").parse("2014-10-13"));
		System.out.println(energy.toString());
		System.out.println(energy.getData());
	}
	
	@Test
	public void testEnergyOfMonth(){
		EnergyOfMonth energyOfMonth = stationService.energyOfMonth("XQDX", new Date());
		System.out.println(energyOfMonth);
	}
	
	@Test
	public void testGetTotalLoadOfMonth(){
		TotalLoadOfMonth totalLoadOfMonth = stationService.getTotalLoadOfMonth("XQDX", new Date());
		System.out.println(totalLoadOfMonth);
	}
}
