import * as React from "react";
import { mount, shallow } from "enzyme";
import {
  RawDesignerFarmwareList as DesignerFarmwareList,
  DesignerFarmwareListProps,
  mapStateToProps,
} from "../list";
import { fakeFarmwares } from "../../../__test_support__/fake_farmwares";
import { fakeState } from "../../../__test_support__/fake_state";
import {
  fakeFarmwareInstallation,
} from "../../../__test_support__/fake_state/resources";
import {
  buildResourceIndex,
} from "../../../__test_support__/resource_index_builder";
import { SearchField } from "../../../ui/search_field";

describe("<DesignerFarmwareList />", () => {
  const fakeProps = (): DesignerFarmwareListProps => ({
    dispatch: jest.fn(),
    currentFarmware: undefined,
    farmwares: {},
  });

  it("renders empty farmware list panel", () => {
    const wrapper = mount(<DesignerFarmwareList {...fakeProps()} />);
    ["no farmware yet", "add a farmware"].map(string =>
      expect(wrapper.text().toLowerCase()).toContain(string));
  });

  it("renders farmware list panel", () => {
    const p = fakeProps();
    p.farmwares = fakeFarmwares();
    const wrapper = mount(<DesignerFarmwareList {...p} />);
    ["my fake farmware"].map(string =>
      expect(wrapper.text().toLowerCase()).toContain(string));
  });

  it("changes search term", () => {
    const wrapper = shallow<DesignerFarmwareList>(
      <DesignerFarmwareList {...fakeProps()} />);
    expect(wrapper.state().searchTerm).toEqual("");
    wrapper.find(SearchField).simulate("change", "my farmware");
    expect(wrapper.state().searchTerm).toEqual("my farmware");
  });
});

describe("mapStateToProps()", () => {
  it("returns props", () => {
    const state = fakeState();
    const farmware = fakeFarmwareInstallation();
    farmware.body.package = "fake farmware";
    farmware.body.id = 1;
    state.resources = buildResourceIndex([farmware]);
    const props = mapStateToProps(state);
    expect(props.farmwares).toEqual({
      "fake farmware (pending install...)": expect.any(Object)
    });
  });
});
