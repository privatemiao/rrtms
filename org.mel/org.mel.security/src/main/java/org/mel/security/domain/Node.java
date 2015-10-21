package org.mel.security.domain;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;

@XmlAccessorType(XmlAccessType.FIELD)
public class Node implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@XmlAttribute
	private String id;
	@XmlAttribute
	private NodeType type;
	@XmlAttribute
	private String text;
	@XmlAttribute
	private String desc;
	@XmlAttribute
	private String css;
	@XmlAttribute
	private String url;
	@XmlAttribute
	private String method;
	@XmlAttribute
	private boolean except = false;
	@XmlAttribute
	private boolean opener = false;

	@XmlElement(name = "node")
	private List<Node> nodes = new ArrayList<>();

	private String parentId;

	private int sequence = 0;

	public Node() {
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public NodeType getType() {
		return type;
	}

	public void setType(NodeType type) {
		this.type = type;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String getCss() {
		return css;
	}

	public void setCss(String css) {
		this.css = css;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public List<Node> getNodes() {
		return nodes;
	}

	public void setNodes(List<Node> nodes) {
		this.nodes = nodes;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public int getSequence() {
		return sequence;
	}

	public void setSequence(int sequence) {
		this.sequence = sequence;
	}

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}

	public boolean isExcept() {
		return except;
	}

	public void setExcept(boolean except) {
		this.except = except;
	}

	public boolean isOpener() {
		return opener;
	}

	public void setOpener(boolean opener) {
		this.opener = opener;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Node other = (Node) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Node [id=" + id + ", type=" + type + ", text=" + text + ", desc=" + desc + ", css=" + css + ", url=" + url + ", method=" + method + ", except=" + except + ", parentId=" + parentId
				+ ", sequence=" + sequence + ", opener=" + opener + "]";
	}

}
