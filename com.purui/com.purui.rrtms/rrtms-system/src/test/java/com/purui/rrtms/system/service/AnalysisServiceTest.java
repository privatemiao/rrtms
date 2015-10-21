package com.purui.rrtms.system.service;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.purui.rrtms.system.domain.AnalysisActionParam;
import com.purui.rrtms.system.domain.AnalysisEnergyWrapper;
import com.purui.rrtms.system.domain.AnalysisLoadWrapper;
import com.purui.rrtms.system.domain.AnalysisPowerIndicatorParam;
import com.purui.rrtms.system.domain.TotalEnergy;
import com.purui.rrtms.system.domain.TotalLoad;
import com.purui.rrtms.system.entity.DataPoint;
import com.purui.rrtms.system.entity.Point;
import com.purui.rrtms.system.utils.MongoDBUtil;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class AnalysisServiceTest {
	@Resource
	AnalysisService analysisService;
	@Resource
	AnalysisEnergyService analysisEnergyService;
	@Resource
	protected MongoDBUtil mongoDBUtil;

	@Test
	public void testCompareLoadByAreaName() throws ParseException {
		// {"type":"day","startDate":1404230400000,"endDate":null,"compareBy":"area","compareByValue":["吴中区","工业园区"]}
		AnalysisActionParam param = new AnalysisActionParam();
		param.setType("day");
		param.setStartDate(new SimpleDateFormat("yyyy-MM-dd").parse("2014-07-01"));
		param.setEndDate(new SimpleDateFormat("yyyy-MM-dd").parse("2014-07-02"));
		param.setCompareBy("area");
		param.setCompareByValue(new String[] { "吴中区", "工业园区" });
		// param.setCompareByValue(new String[]{"吴中区"});
		// param.setCompareByValue(null);
		List<AnalysisLoadWrapper> wrappers = analysisService.compareLoad(param);

		for (AnalysisLoadWrapper wrapper : wrappers) {
			System.out.println(wrapper.getName() + " - " + new SimpleDateFormat("yyy-MM-dd").format(wrapper.getDate()));
			for (TotalLoad load : wrapper.getTotalLoads()) {
				System.out.println("\t" + load.toString());
			}
			System.out.println(wrapper.getTotalLoads().size());
		}
	}

	@Test
	public void testCompareLoadByIndustry() throws ParseException {
		AnalysisActionParam param = new AnalysisActionParam();
		param.setType("day");
		param.setStartDate(new SimpleDateFormat("yyyy-MM-dd").parse("2013-07-01"));
		param.setEndDate(new SimpleDateFormat("yyyy-MM-dd").parse("2014-07-02"));
		param.setCompareBy("industry");
		// param.setCompareByValue(new String[]{"4010", "4290"});
		param.setCompareByValue(new String[] { "4010" });
		// param.setCompareByValue(null);
		List<AnalysisLoadWrapper> wrappers = analysisService.compareLoad(param);

		for (AnalysisLoadWrapper wrapper : wrappers) {
			System.out.println(wrapper.getName() + " - " + new SimpleDateFormat("yyy-MM-dd").format(wrapper.getDate()));
			if (wrapper.getTotalLoads() == null) {
				break;
			}
			for (TotalLoad load : wrapper.getTotalLoads()) {
				System.out.println("\t" + load.toString());
			}
			System.out.println(wrapper.getTotalLoads().size());
		}
	}

	@Test
	public void testCompareEnergyByAreaName() throws ParseException {
		// {"type":"day","startDate":1404230400000,"endDate":null,"compareBy":"area","compareByValue":["吴中区","工业园区"]}
		AnalysisActionParam param = new AnalysisActionParam();
		param.setType("day");
		param.setStartDate(new SimpleDateFormat("yyyy-MM-dd").parse("2014-09-17"));
		param.setEndDate(new SimpleDateFormat("yyyy-MM-dd").parse("2014-09-18"));
		param.setCompareBy("area");
		// param.setCompareByValue(new String[]{"吴中区", "工业园区"});
		// param.setCompareByValue(new String[]{"吴中区"});
		// param.setCompareByValue(null);
		List<AnalysisEnergyWrapper> wrappers = analysisEnergyService.compareEnergy(param);

		for (AnalysisEnergyWrapper wrapper : wrappers) {
			System.out.println(wrapper.getName() + " - " + new SimpleDateFormat("yyy-MM-dd").format(wrapper.getDate()));
			for (TotalEnergy load : wrapper.getTotalEnergys()) {
				System.out.println("\t" + load.toString());
			}
			System.out.println(wrapper.getTotalEnergys().size());
		}
	}

	@Test
	public void testCompareEnergyByIndustry() throws ParseException {
		AnalysisActionParam param = new AnalysisActionParam();
		param.setType("day");
		param.setStartDate(new SimpleDateFormat("yyyy-MM-dd").parse("2014-07-01"));
		param.setEndDate(new SimpleDateFormat("yyyy-MM-dd").parse("2014-07-02"));
		param.setCompareBy("industry");
		// param.setCompareByValue(new String[]{"4010", "4290"});
		// param.setCompareByValue(new String[]{"4010"});
		param.setCompareByValue(null);
		List<AnalysisEnergyWrapper> wrappers = analysisEnergyService.compareEnergy(param);

		for (AnalysisEnergyWrapper wrapper : wrappers) {
			System.out.println(wrapper.getName() + " - " + new SimpleDateFormat("yyy-MM-dd").format(wrapper.getDate()));
			if (wrapper.getTotalEnergys() == null) {
				break;
			}
			for (TotalEnergy energy : wrapper.getTotalEnergys()) {
				System.out.println("\t" + energy.toString());
			}
			System.out.println(wrapper.getTotalEnergys().size());
		}
	}

	@Test
	public void testPowerAnalysis() throws Exception {
		AnalysisPowerIndicatorParam param = new AnalysisPowerIndicatorParam();
		param.setCode("XQDX");
		param.setCurve("4");
		param.setDate(new SimpleDateFormat("yyyy-MM-dd").parse("2014-07-13"));
		param.setKinds(new String[] { "A", "B" });
		param.setPointId(15L);
		Point point = analysisService.powerIndicator(param);
		System.out.println(point);

		for (DataPoint dp : point.getDataPoints()) {
			System.out.println(dp.getmDatas().size());
		}

	}

	@Test
	public void testCompareEnergyByCode() throws ParseException {
		// {"type":"day","startDate":1404230400000,"endDate":null,"compareBy":"area","compareByValue":["吴中区","工业园区"]}
		AnalysisActionParam param = new AnalysisActionParam();
		param.setType("day");
		param.setStartDate(new SimpleDateFormat("yyyy-MM-dd").parse("2014-09-17"));
		param.setEndDate(new SimpleDateFormat("yyyy-MM-dd").parse("2014-09-18"));
		param.setCompareBy("code");
		// param.setCompareByValue(new String[]{"吴中区", "工业园区"});
		param.setCompareByValue(new String[] { "XQDX" });
		// param.setCompareByValue(null);
		List<AnalysisEnergyWrapper> wrappers = analysisEnergyService.compareEnergy(param);

		for (AnalysisEnergyWrapper wrapper : wrappers) {
			System.out.println(wrapper.getName() + " - " + new SimpleDateFormat("yyy-MM-dd").format(wrapper.getDate()));
			for (TotalEnergy load : wrapper.getTotalEnergys()) {
				System.out.println("\t" + load.toString());
			}
			System.out.println(wrapper.getTotalEnergys().size());
		}
	}

	@Test
	public void testCompareLoadByCode() throws ParseException {
		// {"type":"day","startDate":1404230400000,"endDate":null,"compareBy":"area","compareByValue":["吴中区","工业园区"]}
		AnalysisActionParam param = new AnalysisActionParam();
		param.setType("day");
		param.setStartDate(new SimpleDateFormat("yyyy-MM-dd").parse("2014-09-17"));
		param.setEndDate(new SimpleDateFormat("yyyy-MM-dd").parse("2014-09-18"));
		param.setCompareBy("code");
		param.setCompareByValue(new String[] { "XQDX" });
		// param.setCompareByValue(new String[]{"吴中区"});
		// param.setCompareByValue(null);
		List<AnalysisLoadWrapper> wrappers = analysisService.compareLoad(param);

		for (AnalysisLoadWrapper wrapper : wrappers) {
			System.out.println(wrapper.getName() + " - " + new SimpleDateFormat("yyy-MM-dd").format(wrapper.getDate()));
			for (TotalLoad load : wrapper.getTotalLoads()) {
				System.out.println("\t" + load.toString());
			}
			System.out.println(wrapper.getTotalLoads().size());
		}
	}

	@Test
	public void loadAllTotalLoad() throws IOException {
		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		Query query = new Query(Criteria.where("mYear").is(2014)).with(new Sort(Sort.Direction.ASC, "Atime"));

		// List<TotalLoad> list = mongoTemplate.find(query, TotalLoad.class,
		// "TotalFuHe");
		// System.out.println(list.size());
		//
		BufferedWriter os = null;
		try {
			os = new BufferedWriter(new FileWriter("D:/a.csv"));
			for (int i = 0; i < 30; i++) {
				StringBuffer buffer = new StringBuffer();
				buffer.append("begin " + i + "   ");
				query.limit(10000).skip(i * 10000);
				List<TotalLoad> list = mongoTemplate.find(query, TotalLoad.class, "TotalFuHe");
				buffer.append(list.size() + "   ");
				for (TotalLoad l : list) {
					os.write(l.toCSVString() + "\r\n");
				}
				buffer.append("done " + i);
				System.out.println(buffer.toString());
			}

		} catch (Exception e) {
			// TODO: handle exception
		} finally {
			if (os != null) {
				os.close();
			}
		}
	}

	private String fd(Date d) {
		return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(d);
	}

	@Test
	public void analysisHalfHours() throws ParseException {
		Date d = new SimpleDateFormat("yyyy-MM-dd").parse("2014-12-18");
		Calendar start = Calendar.getInstance();
		start.setTime(d);
		Calendar end = Calendar.getInstance();
		end.setTime(d);
		Calendar title = Calendar.getInstance();
		title.setTime(d);

		start.set(Calendar.MINUTE, start.get(Calendar.MINUTE) - 15);
		end.set(Calendar.MINUTE, end.get(Calendar.MINUTE) + 15);

		MongoTemplate mongoTemplate = mongoDBUtil.getMongoTemplate();
		for (int i = 0; i < 48; i++) {
//			System.out.println(fd(title.getTime()) + ": " + fd(start.getTime()) + '~' + fd(end.getTime()));
			
			
			Query query = new Query(Criteria.where("Atime").gte(start.getTime()).andOperator(Criteria.where("Atime").lt(end.getTime())));
			List<TotalLoad> list = mongoTemplate.find(query, TotalLoad.class, "TotalFuHe");
			double total = 0;
			for (TotalLoad l : list){
				total += l.getLoad();
			}
			System.out.println(fd(title.getTime()) + "," + total);
			
			start.add(Calendar.MINUTE, 30);
			end.add(Calendar.MINUTE, 30);
			title.add(Calendar.MINUTE, 30);
		}

	}
}
