package org.mel.security.domain;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

@Target({ TYPE, FIELD, METHOD })
@Retention(RUNTIME)
public @interface Authentication {
	String[] value() default "";
	String desc() default "";
}
