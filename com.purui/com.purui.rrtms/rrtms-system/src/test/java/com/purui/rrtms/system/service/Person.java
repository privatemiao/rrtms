package com.purui.rrtms.system.service;

import org.springframework.data.mongodb.core.mapping.Field;

public class Person {
	@Field("NAME")
	private String name;

	@Field("AGE")
	private int age;

	@Field("COUNT")
	private int count;

	public Person() {
	}

	public Person(String name, int age, int count) {
		super();
		this.name = name;
		this.age = age;
		this.count = count;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public Person(String name, int age) {
		this.name = name;
		this.age = age;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	@Override
	public String toString() {
		return "Person [name=" + name + ", age=" + age + ", count=" + count
				+ "]";
	}

}
